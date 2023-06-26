const songmapDBToModel = ({
  song_id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  songId: song_id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
});

const albummapDBToModel = ({
  album_id,
  title,
  year,
}) => ({
  album_id,
  title,
  year,
});

module.exports = { songmapDBToModel, albummapDBToModel };
