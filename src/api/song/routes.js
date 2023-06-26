const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{song_id}',
    handler: handler.getSongByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{song_id}',
    handler: handler.putSongByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{song_id}',
    handler: handler.deleteSongByIdHandler,
  },
];

module.exports = routes;
