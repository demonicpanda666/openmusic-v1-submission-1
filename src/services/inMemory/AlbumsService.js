const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._album = [];
  }

  addAlbums({ name, year }) {
    const album_id = nanoid(16);

    const newAlbum = {
      name, year, album_id,
    };

    this._album.push(newAlbum);

    const isSuccess = this._album.filter((album) => album.album_id === album_id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return album_id;
  }

  getAlbumById(album_id) {
    const albumbyid = this._album.filter((album) => album.album_id === album_id)[0];
    if (!albumbyid) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return albumbyid;
  }

  editAlbumById(album_id, { name, year }) {
    const albumindex = this._album.findIndex((album) => album.album_id === album_id);

    if (albumindex === -1) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan');
    }

    this._album[albumindex] = {
      ...this._album[albumindex],
      name,
      year,
    };
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
    this._notes.splice(index, 1);
  }
}

module.exports = AlbumsService;
