class LikesHandler {
  constructor(likesService, albumsService) {
    this._likesService = likesService;
    this._albumsService = albumsService;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);

    await this._likesService.verifyLikesAlbum(albumId, credentialId);

    await this._likesService.likeAlbum(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async getLikesHandler(request, h) {
    const { id } = request.params;

    await this._albumsService.getAlbumById(id);

    const { likes, from } = await this._likesService.getAlbumLike(id);

    if (from === 'cache') {
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.code(200);
      response.header('X-Data-Source', from);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);
    await this._likesService.undolikeAlbum(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil undo menyukai album',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
