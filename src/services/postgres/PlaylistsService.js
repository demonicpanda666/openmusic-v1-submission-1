const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { playlistmapDBToModel } = require('../../utils');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async verifyPlaylistsOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak mempunyai hak akses pada playlist ini!');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistsOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id AS "id", playlists.name AS "name", users.username AS "username" FROM playlists
      INNER JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows.map(playlistmapDBToModel);
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongtoPlaylist(playlistId, songId) {
    const querysong = {
      text: 'SELECT id, title, performer FROM songs WHERE id = $1',
      values: [songId],
    };

    const resultsong = await this._pool.query(querysong);

    if (!resultsong.rowCount) {
      throw new NotFoundError('Lagu gagal ditambahkan');
    }

    const id = `playlist-song-${nanoid(16)}`;

    const queryplaylist = {
      text: 'INSERT INTO playlists_song VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    await this._pool.query(queryplaylist);
  }

  async getSongsFromPlaylist(playlistId) {
    const QueryPlaylist = {
      text: `SELECT * 
      FROM playlists_song
      INNER JOIN playlists ON playlists_song.playlist_id = playlists.id 
      INNER JOIN songs ON playlists_song.song_id = songs.id 
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const QueryUser = {
      text: `SELECT owner FROM playlists
    INNER JOIN users ON playlists_song.user_id = users.id
    WHERE users.id = $1`,
      values: [playlistId],
    };

    const QuerySong = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists_song
      INNER JOIN songs ON playlists_song.song_id = songs.id
      WHERE songs.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(QueryPlaylist);
    const userResult = await this._pool.query(QueryUser);
    const songResult = await this._pool.query(QuerySong);

    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan!');
    }

    if (!userResult.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    if (!songResult.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      username: userResult.rows[0].username,
      songs: songResult.rows,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlists_song
        WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist song gagal dihapus, playlist_id dan song_id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
