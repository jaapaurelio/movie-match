require("dotenv").config();

const cors = require("cors");
const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const nextI18NextMiddleware = require("next-i18next/middleware");
const nextI18next = require("./i18n");
const enforce = require("express-sslify");
const compression = require("compression");
const nakedRedirect = require("express-naked-redirect");
const { join } = require("path");
const { parse } = require("url");
const passport = require('passport');
const session = require('express-session');

require("./server/models/genre.model");
require("./server/models/room.model");
require("./server/models/user.model");
const authInit = require('./auth/init');

authInit();
const appRoutes = require("./server/routes");
const appAuthRoutes = require("./server/auth-routes");

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
      server.use(
        nakedRedirect({
          reverse: true,
          status: 301
        })
      );
      server.use(enforce.HTTPS({ trustProtoHeader: true }));
    }

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true
    }));
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(appRoutes);
    server.use(appAuthRoutes);
    nextI18NextMiddleware(nextI18next, app, server);

    server.get("*", (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      if (pathname === "/service-worker.js") {
        const filePath = join(__dirname, ".next", pathname);

        app.serveStatic(req, res, filePath);
      } else if (req.url.startsWith("static/workbox/")) {
        app.serveStatic(req, res, join(__dirname, req.url));
      } else if (req.url.includes(".well-known/assetlinks.json")) {
        const filePath = join(
          __dirname,
          "static",
          ".well-known",
          "assetlinks.json"
        );
        app.serveStatic(req, res, filePath);
      } else {
        handler(req, res);
      }
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
