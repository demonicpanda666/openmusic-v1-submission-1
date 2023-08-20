const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsSongsActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongPlaylistActivities(playlistId, songId, userId, action, time) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
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
}

module.exports = PlaylistsSongsActivitiesService;
