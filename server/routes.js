var router = require("express").Router();
const Pusher = require("pusher");
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");
var randomstring = require("randomstring");
const mongoose = require("mongoose");
var Genre = mongoose.model("Genre");
var Room = mongoose.model("Room");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

const database = {
  genres: {},
  rooms: {}
};

const roomIds = [];

const generateRoomId = function() {
  let roomId;
  do {
    roomId = randomstring.generate({
      length: 4,
      charset: "alphabetic",
      readable: true,
      capitalization: "uppercase"
    });
  } while (roomIds.some(id => roomId === id));

  return roomId;
};

const getMovies = async function({
  selectedGenres,
  startYear,
  endYear,
  ratingGte,
  ratingLte
}) {
  const baseQuery = {
    "vote_count.gte": 500,
    "primary_release_date.gte": `${startYear}-01-01`,
    "primary_release_date.lte": `${endYear}-12-30`,
    "vote_average.gte": ratingGte,
    "vote_average.lte": ratingLte,
    with_genres: selectedGenres.join("|")
  };

  let m = [];
  for (let i = 1; i < 2; i++) {
    m.push(moviedb.discoverMovie({ ...baseQuery, page: i }));
  }

  const moviesListResult = await Promise.all(m);

  let moviesList = [];
  for (let i = 0; i < moviesListResult.length; i++) {
    moviesList = moviesList.concat(moviesListResult[i].results);
  }

  const movies = moviesList.reduce((acc, movie) => {
    acc.push({
      id: movie.id,
      title: movie.title,
      mmStats: {
        usersLike: [],
        usersSeen: []
      }
    });

    return acc;
  }, []);

  return movies;
};

router.post("/api/room/:roomId/:movieId/:like", async (req, res) => {
  const { movieId, roomId } = req.params;
  const { userId } = req.cookies;
  const like = req.params.like === "like";

  const room = await Room.findOne({ id: roomId });
  const movieIndex = room.movies.findIndex(movie => movie.id == movieId);

  const movie = room.movies[movieIndex];
  const numberSeenMovies = room.movies.filter(movie =>
    movie.usersSeen.includes(userId)
  ).length;

  if (like) {
    movie.usersLike.push(userId);

    if (
      room.users.length >= 2 &&
      numberSeenMovies > 5 &&
      movie.usersLike.length >= room.users.length
    ) {
      movie.matched = true;
      pusher.trigger(`room-${roomId}`, "movie-matched", { movie });
    }
  }

  if (!movie.usersSeen.includes(userId)) {
    movie.usersSeen.push(userId);
  }
  room.movies[movieIndex] = movie;

  await room.save();

  res.send({});
});

router.post("/api/rooms/", async (req, res) => {
  const { selectedGenres, startYear, endYear, ratingGte, ratingLte } = req.body;
  const roomId = generateRoomId();

  const genres = await Genre.find();
  const movies = await getMovies({
    selectedGenres,
    startYear,
    endYear,
    ratingGte,
    ratingLte
  });

  const roomGenres = selectedGenres.map(genreId =>
    genres.find(g => g.id === genreId)
  );

  const room = new Room({
    id: roomId,
    movies,
    users: [],
    info: {
      genres: roomGenres,
      startYear,
      endYear,
      ratingGte,
      ratingLte
    }
  });

  await room.save();

  return res.send({ success: true, roomId: roomId });
});

router.get("/api/room/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.cookies.userId;

  const room = await Room.findOne({ id: roomId });

  if (room && !room.users.find(id => id === userId)) {
    room.users.push(userId);
    await room.save();
    pusher.trigger(`room-${roomId}`, "users", room.users);
  }

  res.send({ room });
});

module.exports = router;
