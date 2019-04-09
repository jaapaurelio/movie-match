const router = require("express").Router();
const Pusher = require("pusher");
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");
const randomstring = require("randomstring");
const mongoose = require("mongoose");
const Genre = mongoose.model("Genre");
const Room = mongoose.model("Room");
const User = mongoose.model("User");
const shuffle = require("shuffle-array");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

const generateRoomId = async function() {
  const roomIdsMap = await Room.find(
    {},
    {
      _id: 0,
      id: 1
    }
  ).exec();
  const roomIds = roomIdsMap.map(r => r.id);

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

async function mapMovies(movies) {
  const allGenres = await Genre.find({}).exec();

  return movies.reduce((acc, movie) => {
    const genres = movie.genre_ids.map(mgId => {
      const genre = allGenres.find(g => g.id === mgId);

      return {
        id: genre.id,
        name: genre.name
      };
    });

    acc.push({
      id: movie.id,
      usersLike: [],
      usersSeen: [],
      genres,
      title: movie.title,
      original_title: movie.original_title,
      poster_path: movie.poster_path,
      runtime: movie.runtime,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      original_language: movie.vote_average
    });

    return acc;
  }, []);
}

const getMovies = async function({
  selectedGenres,
  startYear,
  endYear,
  ratingGte,
  ratingLte,
  page
}) {
  const baseQuery = {
    "vote_count.gte": 500,
    "primary_release_date.gte": `${startYear}-01-01`,
    "primary_release_date.lte": `${endYear}-12-30`,
    "vote_average.gte": ratingGte,
    "vote_average.lte": ratingLte,
    with_genres: selectedGenres.join("|")
  };

  const moviesListResponse = await moviedb.discoverMovie({
    ...baseQuery,
    page
  });

  const moviesList = moviesListResponse.results;

  const movies = await mapMovies(moviesList);

  return { movies, totalPages: moviesListResponse.total_pages };
};

function getRecomendationForMovie(movieId, roomId) {
  return moviedb
    .movieRecommendations({ id: movieId })
    .then(async recomendations => {
      let roomForRecomendation = await Room.findOne({ id: roomId }).exec();

      if (recomendations && recomendations.results) {
        let notInRoom = recomendations.results.filter(
          movie =>
            !roomForRecomendation.movies.find(
              roomMovie => movie.id === roomMovie.id
            )
        );

        notInRoom = notInRoom.slice(0, 6);

        notInRoom = await mapMovies(notInRoom);

        roomForRecomendation.movies = [
          ...roomForRecomendation.movies,
          ...notInRoom
        ];

        roomForRecomendation.save();

        pusher.trigger(`room-${roomId}`, "new-movies", notInRoom);
      }
    });
}

router.post("/api/room/similar/:roomId/:movieId", async (req, res) => {
  const { movieId, roomId } = req.params;

  console.log("recomendation");
  getRecomendationForMovie(movieId, roomId);
  res.send({});
});

router.post("/api/room/:roomId/:movieId/:like", async (req, res) => {
  const { movieId, roomId } = req.params;
  const { userId } = req.cookies;
  const like = req.params.like === "like";

  let room = await Room.findOne({ id: roomId }).exec();
  const movieIndex = room.movies.findIndex(movie => movie.id == movieId);
  const movie = room.movies[movieIndex];

  movie.usersSeen.push(userId);

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
      const matches = room.movies
        .filter(m => {
          return m.usersLike.length >= room.users.length;
        })
        .map(m => m.id);

      if (matches.length >= 3) {
        room.matched = true;
        room.matches = shuffle(matches);

        pusher.trigger(`room-${roomId}`, "movie-matched", {
          matches: room.matches
        });
      }
    }

    // get movies like this one
    getRecomendationForMovie(movieId, roomId);
  }

  room.movies[movieIndex] = movie;

  room = await room.save();

  // Get more movies
  if (numberSeenMovies + 2 == room.movies.length) {
    const info = room.info;
    if (room.info.page < room.info.totalPages) {
      info.page++;
    } else {
      info.ratingLte = Math.round((room.info.ratingGte - 0.1) * 100) / 100;
      info.ratingGte = Math.round((room.info.ratingLte - 0.5) * 100) / 100;
      info.page = 1;
    }

    const { movies, totalPages } = await getMovies({
      selectedGenres: room.info.genres.map(g => g.id),
      startYear: room.info.startYear,
      endYear: room.info.endYear,
      ratingGte: room.info.ratingGte,
      ratingLte: room.info.ratingLte,
      page: room.info.page
    });

    room = await Room.findOne({ id: roomId }).exec();

    let moviesNotInRoom = movies.filter(
      movie => !room.movies.find(roomMovie => movie.id === roomMovie.id)
    );

    room.movies = [...room.movies, ...moviesNotInRoom];
    room.info = info;
    room.info.totalPages = totalPages;
    pusher.trigger(`room-${roomId}`, "new-movies", moviesNotInRoom);

    await room.save();
  }

  res.send({});
});

router.post("/api/user/", async (req, res) => {
  const userId = req.cookies.userId;
  const name = req.body.name;

  console.log("userId", userId, name);

  let query = { id: userId };
  let update = { id: userId, name };
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  let model = await User.findOneAndUpdate(query, update, options);

  return res.send({ success: true });
});

router.post("/api/rooms/", async (req, res) => {
  const { selectedGenres, startYear, endYear, rating } = req.body;
  const roomId = await generateRoomId();

  let ratingGte = 1;
  let ratingLte = 10;

  if (rating == 0) {
    ratingGte = 1;
    ratingLte = 5;
  }

  if (rating == 1) {
    ratingGte = 5;
    ratingLte = 10;
  }

  if (rating == 2) {
    ratingGte = 7;
    ratingLte = 10;
  }

  const genres = await Genre.find().exec();
  const { movies, totalPages } = await getMovies({
    selectedGenres,
    startYear,
    endYear,
    ratingGte,
    ratingLte,
    page: 1
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
      rating,
      ratingGte,
      ratingLte,
      page: 1,
      totalPages
    }
  });

  await room.save();

  return res.send({ success: true, roomId: roomId });
});

router.get("/api/room/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.cookies.userId;

  const room = await Room.findOne({ id: roomId }).exec();

  if (!room) {
    res.send({ noRoom: true });
  }

  if (room && !room.users.find(id => id === userId)) {
    room.users.push(userId);
    await room.save();
    pusher.trigger(`room-${roomId}`, "users", room.users);
  }

  room.matches = room.matches.slice(0, 3);

  res.cookie("roomId", roomId, {
    maxAge: 365 * 24 * 60 * 60 * 1000
  });

  res.send({ room });
});
module.exports = router;
