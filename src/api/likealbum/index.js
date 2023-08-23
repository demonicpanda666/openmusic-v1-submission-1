const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likesalbum',
  version: '1.0.0',
  register: async (server, { likesService, albumsService }) => {
    const likesHandler = new LikesHandler(likesService, albumsService);
    server.route(routes(likesHandler));
  },
};
