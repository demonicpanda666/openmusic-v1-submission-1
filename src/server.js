require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/song');
const albums = require('./api/album');
const AlbumsService = require('./services/inMemory/AlbumsService');
const SongsService = require('./services/inMemory/SongsService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: { songs, albums },
    options: {
      service: { songsService, albumsService },
      validator: { AlbumsValidator, SongsValidator },
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
