const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { songmapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addNote({
    title, year, genre, performer, duration, album_id,
  }) {
    const song_id = nanoid(10);

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING song_id',
      values: [song_id, title, year, genre, performer, duration, album_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].song_id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].song_id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map(songmapDBToModel);
  }

  async getSongById(song_id) {
    const query = {
      text: 'SELECT * FROM notes WHERE song_id = $1',
      values: [song_id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(songmapDBToModel)[0];
  }

  async editSongById(song_id, {
    title, year, genre, performer, duration, album_id,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5 duration = $6, album_id = $7 WHERE song_id = $1 RETURNING song_id',
      values: [song_id, title, year, genre, performer, duration, album_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(song_id) {
    const query = {
      text: 'DELETE FROM songsWHERE song_id = $1 RETURNING song_id',
      values: [song_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = SongsService;
