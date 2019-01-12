const cors = require("cors");
const next = require("next");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");

const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handler = app.getRequestHandler();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

let roomIdCounter = 100;
const __groups = {};
let __genres = {};

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

  console.log(baseQuery);

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
      genres_name: movie.genre_ids.map(genreId => __genres[genreId].name),
      mm_stats: {
        user_likes: {},
        user_seen: {}
      }
    };
    return acc;
  }, {});

  return movies;
};

const getGenres = async function() {
  const genreList = await moviedb.genreMovieList();
  const genres = genreList.genres.reduce((acc, genre) => {
    acc[genre.id] = genre;
    return acc;
  }, {});

  return genres;
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    server.post("/api/groups/:roomId/:userId/:movieId/:like", (req, res) => {
      const { movieId, userId, roomId } = req.params;
      const like = req.params.like === "true";

      let totalLikes = __groups[roomId].likes[movieId] || 0;
      const numberOfUsers = __groups[roomId].numberOfUser;

      if (like) {
        totalLikes++;

        if (totalLikes >= numberOfUsers) {
          pusher.trigger(`room-${roomId}`, "movie-matched", { movieId });
        }
      }

      __groups[roomId].movies[movieId].mm_stats.user_likes[userId] = like;
      __groups[roomId].movies[movieId].mm_stats.user_seen[userId] = true;
      __groups[roomId].likes[movieId] = totalLikes;

      res.send({});
    });

    server.post("/api/rooms/", async (req, res) => {
      const movies = await getMovies(req.body);

      const numberOfMovies = Object.keys(movies).length;

      if (numberOfMovies < 20) {
        return res.send({ noMovies: true });
      }

      roomIdCounter++;

      __groups[roomIdCounter] = {
        movies,
        likes: {},
        numberOfUser: 2
      };

      return res.send({ success: true, roomId: roomIdCounter });
    });

    server.get("/api/groups/:roomId", (req, res) => {
      const roomId = req.params.roomId;

      const group = __groups[roomId];

      res.send({ group });
    });

    server.get("*", (req, res) => {
      return handler(req, res);
    });

    server.listen(port, async err => {
      if (err) throw err;

      __genres = await getGenres();

      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
