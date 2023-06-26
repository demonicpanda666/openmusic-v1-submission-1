const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const { albummapDBToModel } = require('../utils');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ title, year }) {
    const album_id = nanoid(16);

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3) RETURNING album_id',
      values: [album_id, title, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].album_id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].album_id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(albummapDBToModel);
  }

  async getAlbumById(album_id) {
    const query = {
      text: 'SELECT * FROM albums WHERE album_id = $1',
      values: [album_id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows.map(albummapDBToModel)[0];
  }

  async editAlbumById(album_id, { title, year }) {
    const query = {
      text: 'UPDATE albums SET title = $2, year = $3 WHERE album_id = $1 RETURNING album_id',
      values: [album_id, title, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteNoteById(album_id) {
    const query = {
      text: 'DELETE FROM notes WHERE album_id = $1 RETURNING album_id',
      values: [album_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = AlbumsService;
