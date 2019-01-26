var router = require("express").Router();
const Pusher = require("pusher");
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

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

let roomIdCounter = 100;

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
  for (let i = 1; i < 10; i++) {
    m.push(moviedb.discoverMovie({ ...baseQuery, page: i }));
  }

  const moviesL = await Promise.all(m);

  let movieList = [];

  moviesL.forEach(movie => {
    movieList = movieList.concat(movie.results);
  });

  const movies = movieList.reduce((acc, movie) => {
    acc[movie.id] = {
      ...movie,
      genres_name: movie.genre_ids.map(
        genreId => database.genres[genreId].name
      ),
      mm_stats: {
        user_likes: {},
        user_seen: {}
      }
    };
    return acc;
  }, {});

  return movies;
};

router.post("/api/room/:roomId/:userId/:movieId/:like", (req, res) => {
  const { movieId, userId, roomId } = req.params;
  const like = req.params.like === "true";

  let totalLikes = database.rooms[roomId].likes[movieId] || 0;
  const numberOfUsers = database.rooms[roomId].numberOfUser;
  database.rooms[roomId].numberOfUser = 2;

  if (like) {
    totalLikes++;

    if (totalLikes >= 2) {
      pusher.trigger(`room-${roomId}`, "movie-matched", { movieId });
    }
  }

  database.rooms[roomId].movies[movieId].mm_stats.user_likes[userId] = like;
  database.rooms[roomId].movies[movieId].mm_stats.user_seen[userId] = true;
  database.rooms[roomId].likes[movieId] = totalLikes;

  res.send({});
});

router.post("/api/rooms/", async (req, res) => {
  const { selectedGenres, startYear, endYear, ratingGte, ratingLte } = req.body;

  const movies = await getMovies({
    selectedGenres,
    startYear,
    endYear,
    ratingGte,
    ratingLte
  });

  const numberOfMovies = Object.keys(movies).length;

  if (numberOfMovies < 20) {
    return res.send({ noMovies: true });
  }

  roomIdCounter++;

  const genres = selectedGenres.map(genreId => database.genres[genreId].name);

  database.rooms[roomIdCounter] = {
    movies,
    likes: {},
    users: [],
    info: {
      genres,
      startYear,
      endYear,
      ratingGte,
      ratingLte
    }
  };

  return res.send({ success: true, roomId: roomIdCounter });
});

router.get("/api/room/:roomId/:userId", (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.params.userId;

  const group = database.rooms[roomId];

  console.log(userId, group && group.users);

  if (group && !group.users.find(id => id === userId)) {
    group.users.push(userId);
    pusher.trigger(`room-${roomId}`, "users", group.users);
  }

  res.send({ group });
});

module.exports = router;
