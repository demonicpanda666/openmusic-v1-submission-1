class PlaylistsHandler {
  constructor(service, validator, playlistsongactivitiesservice) {
    this._playlistsservice = service;
    this._playlistsongactivitiesservice = playlistsongactivitiesservice;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistByIdHandler = this.getSongsFromPlaylistByIdHandler.bind(this);
    this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this);
    this.getSongPlaylistActivitiesHandler = this.getSongPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsservice.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._playlistsservice.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsservice.verifyPlaylistsOwner(id, credentialId);
    await this._playlistsservice.deletePlaylistById(id);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });

    return response;
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateSongtoPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._playlistsservice.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsservice.addSongtoPlaylist(playlistId, songId);
    const action = 'add';
    const time = new Date().toISOString();
    await this._playlistsongactivitiesservice.addSongPlaylistActivities(
      playlistId, songId, credentialId, action, time,
    );
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsservice.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsservice.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsservice.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsservice.deleteSongFromPlaylist(playlistId, songId);

    const action = 'delete';
    const time = new Date().toISOString();
    await this._playlistsongactivitiesservice.addSongPlaylistActivities(
      playlistId, songId, credentialId, action, time,
    );

    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  }

  async getSongPlaylistActivitiesHandler(request, h) {
    const { id } = request.params;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsservice.verifyPlaylistsOwner(id, credentialId);
    const activities = await this._playlistsongactivitiesservice.getSongPlaylistActivities(
      playlistId,
    );

    const response = h.response({
      status: 'success',
      data: activities,
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;
