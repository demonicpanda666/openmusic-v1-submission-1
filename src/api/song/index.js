const SongsHandler = require('./handler');
const songsroutes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(songsroutes(songsHandler));
  },
};
