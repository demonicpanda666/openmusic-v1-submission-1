const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, album_id,
  }) {
    const song_id = nanoid(10);

    const newSong = {
      title, year, genre, performer, duration, album_id, song_id,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.song_id === song_id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return song_id;
  }

  getSong() {
    return this._songs;
  }

  getSongById(song_id) {
    const songbyid = this._songs.filter((s) => s.song_id === song_id)[0];
    if (!songbyid) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return songbyid;
  }

  editSongById(song_id, {
    title, year, genre, performer, duration, album_id,
  }) {
    const index = this._songs.findIndex((s) => s.song_id === song_id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      album_id,
    };
  }

  deleteSongById(song_id) {
    const index = this._songs.findIndex((s) => s.song_id === song_id);
    if (index === -1) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
