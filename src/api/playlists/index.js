const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    {
      service,
      validator,
      playlistsongactivitiesservice,
    },
  ) => {
    const playlistHandler = new PlaylistsHandler(
      service,
      validator,
      playlistsongactivitiesservice,
    );

    server.route(routes(playlistHandler));
  },
};
