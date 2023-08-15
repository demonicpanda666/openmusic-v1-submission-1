/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists_song', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      unique: true,
      references: 'playlists(id)',
    },
    song_id: {
      type: 'VARCHAR(50)',
      unique: true,
      references: 'songs(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_song');
};
