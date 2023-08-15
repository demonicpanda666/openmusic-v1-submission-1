/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // membuat table collaborations
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      unique: true,
      references: 'playlists(id)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      unique: true,
      references: 'users(id)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('collaborations');
};
