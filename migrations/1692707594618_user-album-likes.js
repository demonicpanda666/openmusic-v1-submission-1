/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      notNull: true,
      onDelete: 'cascade',
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: 'albums(id)',
      notNull: true,
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('user_album_likes', 'unique_user_id_and_album_id', 'UNIQUE(user_id, album_id)');
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
