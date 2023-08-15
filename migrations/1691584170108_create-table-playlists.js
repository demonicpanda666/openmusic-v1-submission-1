/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      unique: true,
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      unique: true,
      references: 'users(id)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
