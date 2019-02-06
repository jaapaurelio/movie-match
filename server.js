require("dotenv").config();

const cors = require("cors");
const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userMiddleware = require("./server/user-middleware");
const mongoose = require("mongoose");
const nextI18NextMiddleware = require("next-i18next/middleware");
const nextI18next = require("./i18n");
const enforce = require("express-sslify");
const compression = require("compression");

require("./server/models/genre.model");
require("./server/models/room.model");

const appRoutes = require("./server/routes");
var Genre = mongoose.model("Genre");

const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handler = app.getRequestHandler();

const loadGenres = async function() {
  const genreList = await moviedb.genreMovieList();
  const genresPromise = genreList.genres.map(genre => {
    return Genre.updateOne({ id: genre.id }, genre, {
      upsert: true,
      setDefaultsOnInsert: true
    });
  }, {});

  return Promise.all(genresPromise);
};

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(compression());

    if (process.env.NODE_ENV === "production") {
      server.use(enforce.HTTPS({ trustProtoHeader: true }));
    }

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(userMiddleware);
    server.use(appRoutes);
    nextI18NextMiddleware(nextI18next, app, server);

    server.get("*", (req, res) => {
      return handler(req, res);
    });

    server.listen(port, async err => {
      if (err) throw err;

      await loadGenres();

      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
