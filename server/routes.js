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
const { ROOM_STATES } = require("../lib/constants");

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

function addMoviesToRoom(room, movies, userId) {
  const roomId = room.id;
  const wait = movies.map(movie => {
    if (room.movies[movie.id]) {
      return Room.findOneAndUpdate(
        { id: roomId },
        {
          $push: {
            [`movies.${movie.id}.usersRecomendation`]: userId
          }
        }
      );
    } else {
      return Room.findOneAndUpdate(
        { id: roomId },
        {
          [`movies.${movie.id}`]: {
            id: movie.id,
            title: movie.title,
            usersLike: [],
            usersDislike: [],
            usersSeen: [],
            usersRecomendation: [userId]
          }
        }
      );
    }
  });

  return Promise.all(wait);
}

router.post("/api/room/add-movies-configuration/:roomId", async (req, res) => {
  const { userId } = req.cookies;
  const { roomId } = req.params;
  const { movies, config } = req.body;

  let room = await Room.findOne({ id: roomId });

  if (!room || room.state !== ROOM_STATES.CONFIGURING) {
    return res.send({
      success: false,
      error: "No room with this id in configuring phase"
    });
  }

  const userConfig = room.configurationByUser[userId];

  if (userConfig) {
    return res.send({
      success: false,
      error: "User already with config for this room"
    });
  }

  await addMoviesToRoom(room, movies, userId);

  room = await Room.findOneAndUpdate(
    { id: roomId },
    {
      [`configurationByUser.${userId}`]: {
        ...config
      }
    },
    { new: true }
  );

  if (Object.keys(room.configurationByUser).length === room.users.length) {
    room.state = ROOM_STATES.MATCHING;

    await Room.findOneAndUpdate({ id: roomId }, room);

    pusher.trigger(`room-${roomId}`, "configuration-done", {});
  }

  return res.send({
    success: true
  });
});

router.post("/api/room/add-movies/:roomId", async (req, res) => {
  const { userId } = req.cookies;
  const { roomId } = req.params;
  const { movies, page, totalPages } = req.body;

  let room = await Room.findOne({ id: roomId });

  await addMoviesToRoom(room, movies, userId);

  if (page) {
    room = await Room.findOneAndUpdate(
      { id: roomId },
      {
        [`configurationByUser.${userId}.page`]: page,
        [`configurationByUser.${userId}.totalPages`]: totalPages
      },
      { new: true }
    );
  }

  room = await Room.findOne({ id: roomId });

  // send updated movies to clients
  const movieToSend = {};

  movies.forEach(movie => {
    movieToSend[movie.id] = room.movies[movie.id];
  });

  pusher.trigger(`room-${roomId}`, "new-movies", movieToSend);

  return res.send({
    success: true
  });
});

//todo remove
router.post("/api/room/similar/:roomId/:movieId", async (req, res) => {
  const { movieId, roomId } = req.params;

  res.send({});
});

router.post("/api/room/:roomId/:movieId/:like", async (req, res) => {
  const { movieId, roomId } = req.params;
  const { userId } = req.cookies;
  const like = req.params.like === "like";

  let room = await Room.findOne({ id: roomId }).exec();

  if (room.movies[movieId].usersSeen.find(u => u === userId)) {
    return res.send({ success: false, message: "User already set movie like" });
  }

  if (like) {
    room = await Room.findOneAndUpdate(
      { id: roomId },
      {
        $push: {
          [`movies.${movieId}.usersLike`]: userId,
          [`movies.${movieId}.usersSeen`]: userId
        }
      },
      { new: true }
    );

    const movie = room.movies[movieId];

    if (
      room.users.length >= 2 &&
      movie.usersLike.length === room.users.length
    ) {
      const matches = Object.keys(room.movies).filter(movieId => {
        return room.movies[movieId].usersLike.length === room.users.length;
      });

      if (matches.length >= 3) {
        room.matches = shuffle(matches);
        room.state = ROOM_STATES.MATCHED;

        pusher.trigger(`room-${roomId}`, "movie-matched", {
          matches: room.matches
        });

        room = await Room.findOneAndUpdate(
          { id: roomId },
          {
            matches: matches,
            state: ROOM_STATES.MATCHED,
            $push: { [`movies.${movieId}.usersLike`]: userId }
          },
          { new: true }
        );

        return res.send({});
      }
    }
  } else {
    room = await Room.findOneAndUpdate(
      { id: roomId },
      {
        $push: {
          [`movies.${movieId}.usersDislike`]: userId,
          [`movies.${movieId}.usersSeen`]: userId
        }
      },
      { new: true }
    );
  }

  pusher.trigger(`room-${roomId}`, "new-movies", [room.movies[movieId]]);

  res.send({});
});

router.post("/api/user/", async (req, res) => {
  const userId = req.cookies.userId;
  const name = req.body.name;

  let query = { id: userId };
  let update = { id: userId, name };
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  await User.findOneAndUpdate(query, update, options);

  return res.send({ success: true });
});

router.post("/api/create-room", async (req, res) => {
  const roomId = await generateRoomId();

  const room = new Room({
    id: roomId
  });

  await room.save();

  return res.send({ success: true, roomId: roomId });
});

router.post("/api/room/ready/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.cookies.userId;
  let room = await Room.findOne({ id: roomId }).exec();

  if (!room || room.state !== ROOM_STATES.WAITING_ROOM) {
    return res.send({ success: false, message: "Not not accepting users" });
  }

  const exists = room.readies.find(u => u === userId);

  if (exists) {
    return res.send({ success: true, message: "Already in the room" });
  }

  room.readies.push(userId);

  room.save().then(async () => {
    room = await Room.findOne({ id: roomId }).exec();

    if (room.readies.length === room.users.length) {
      room.state = ROOM_STATES.CONFIGURING;
      await room.save();
      pusher.trigger(`room-${roomId}`, "room-ready", {});
    }
  });

  return res.send({ success: true });
});

router.get("/api/room/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.cookies.userId;

  const room = await Room.findOne({ id: roomId }).exec();

  if (!room) {
    return res.send({ message: "No room" });
  }

  const user = await User.findOne({ id: userId }).exec();

  if (!user) {
    return res.send({ message: "No user" });
  }

  const userInRoom = room.users.find(user => user.id === userId);

  if (room.state !== ROOM_STATES.WAITING_ROOM && !userInRoom) {
    return res.send({ message: "User not in room" });
  }

  if (room.state === ROOM_STATES.WAITING_ROOM && !userInRoom) {
    room.users.push(user);
    await Room.findOneAndUpdate({ id: roomId }, room);
    pusher.trigger(`room-${roomId}`, "users", room.users);
  }

  room.matches = room.matches.slice(0, 3);

  res.cookie("roomId", roomId, {
    maxAge: 365 * 24 * 60 * 60 * 1000
  });

  room.movies = room.movies;

  res.send({ room });
});
module.exports = router;
