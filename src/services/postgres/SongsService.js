const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { songmapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(10);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let query = {};

    if (title !== undefined && performer !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) AND  LOWER(performer) LIKE LOWER($2)',
        values: [`%${'kupu'}%`, `%${'peter'}%`],
      };
    } else if (title !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE LOWER (title) LIKE LOWER ($1)',
        values: [`%${'cint'}%`],
      };
    } else if (performer !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE LOWER (performer) LIKE LOWER ($1)',
        values: [`%${'chris'}%`],
      };
    } else {
      query = 'SELECT id, title, performer FROM songs';
    }

    const result = await this._pool.query(query);
    return result.rows.map(songmapDBToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(songmapDBToModel)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, album_id,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5, duration = $6, album_id = $7 WHERE id = $1 RETURNING id',
      values: [id, title, year, genre, performer, duration, album_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = SongsService;
