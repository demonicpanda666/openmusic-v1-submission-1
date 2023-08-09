const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    handler: handler.getAlbumByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/albums/{albumId}',
    handler: handler.putAlbumByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}',
    handler: handler.deleteAlbumByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
