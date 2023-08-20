const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsSongsActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongPlaylistActivities(playlistId, {
    songId, userId, action, time,
  }) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users.username AS "username", songs.title AS "title", playlist_song_activities.action AS "action", playlist_song_activities.time AS "time" FROM playlist_song_activities
        LEFT JOIN users ON users.id = playlist_song_activities.user_id
        LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
        WHERE playlist_song_activities.playlist_id = $1
        ORDER BY playlist_song_activities.action`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      playlistId, activities: result.rows,
    };
  }

  async deleteSongPlaylistActivity(playlistId, activityId) {
    const query = {
      text: `DELETE FROM playlist_song_activities
        WHERE id = $1 AND playlist_id = $2 RETURNING id`,
      values: [playlistId, activityId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist song gagal dihapus, playlist_id dan song_id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsSongsActivitiesService;
