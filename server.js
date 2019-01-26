const cors = require("cors");
const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userMiddleware = require("./server/user-middleware");
const appRoutes = require("./server/routes");
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(userMiddleware);
    server.use(appRoutes);

    server.get("*", (req, res) => {
      return handler(req, res);
    });

    server.listen(port, async err => {
      if (err) throw err;

      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
