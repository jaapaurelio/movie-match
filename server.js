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

let __movies = {};
const __groups = {};
let __genres = {};

const getMovies = async function() {
  const baseQuery = {
    "release_date.gte": "1990-05-07",
    "vote_average.gte": 7
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
      genres_name: movie.genre_ids.map(genreId => __genres[genreId].name)
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

      // new movie
      if (!__groups[roomId].movies[movieId]) {
        __groups[roomId].movies[movieId] = {
          id: movieId,
          mm_stats: {
            user_likes: {},
            user_seen: {}
          }
        };
      }

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

    server.get("/api/groups/:roomId", (req, res) => {
      const roomId = req.params.roomId;

      if (!__groups[roomId]) {
        __groups[roomId] = {
          movies: {},
          likes: {},
          numberOfUser: 2
        };
      }

      const group = __groups[roomId];

      res.send({ group, movies: __movies });
    });

    server.get("*", (req, res) => {
      return handler(req, res);
    });

    server.listen(port, async err => {
      if (err) throw err;

      __genres = await getGenres();
      __movies = await getMovies();

      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
