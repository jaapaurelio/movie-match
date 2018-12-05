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

const groups = {
  AAAA: {}
};
let genres = {};

const getMovies = async function() {
  const baseQuery = {
    "release_date.gte": "1990-05-07",
    "vote_average.gte": 7
  };

  const moviesL = await Promise.all([
    moviedb.discoverMovie({ ...baseQuery, page: 1 }),
    moviedb.discoverMovie({ ...baseQuery, page: 2 }),
    moviedb.discoverMovie({ ...baseQuery, page: 3 })
  ]);

  let movieList = [];

  moviesL.forEach(movie => {
    movieList = movieList.concat(movie.results);
  });

  let movies = movieList.map(movie => ({
    ...movie,
    genres_name: movie.genre_ids.map(genreId => genres[genreId].name)
  }));

  return movies;
};

const getGenres = async function() {
  const genreList = await moviedb.genreMovieList();
  genres = genreList.genres.reduce((acc, genre) => {
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

    server.get("/api/groups/:groupId/", (req, res) => {
      const groupId = req.params.groupId;
      const group = groups[groupId];

      res.send(group);
    });

    server.get("*", (req, res) => {
      return handler(req, res);
    });

    server.listen(port, async err => {
      if (err) throw err;

      genres = await getGenres();
      groups.AAAA.movies = await getMovies();

      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
