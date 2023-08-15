const songmapDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const albummapDBToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const playlistmapDBToModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

module.exports = { songmapDBToModel, albummapDBToModel, playlistmapDBToModel };
