const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { albummapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year, cover_url }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, cover_url],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1',
      values: [id],
    };

    const album = await this._pool.query(query);

    if (!album.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const songquery = {
      text: 'SELECT id, title, performer FROM songs where album_id = $1',
      values: [id],
    };

    const song = await this._pool.query(songquery);

    const finalAlbum = album.rows.map(albummapDBToModel)[0];
    const finalSongs = song.rows;
    // Insert songs to album

    finalAlbum.songs = finalSongs;
    const result = finalAlbum;
    return result;
  }

  async editAlbumById(id, { name, year, cover_url }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, cover_url = $3 WHERE id = $4 RETURNING id',
      values: [name, year, cover_url, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async updateAlbumCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal diperbaharui, album id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
