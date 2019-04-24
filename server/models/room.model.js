var mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  id: Number,
  usersLike: { type: [String], default: [] },
  usersDislike: { type: [String], default: [] },
  usersSeen: { type: [String], default: [] },
  usersRecomendation: { type: [String], default: [] },
  matched: { type: Boolean, default: false },
  title: String,
  original_title: String,
  poster_path: String,
  runtime: Number,
  genres: [{ id: Number, name: String }],
  release_date: String,
  vote_average: Number,
  original_language: String
});

const InfoSchema = new mongoose.Schema({
  genres: [Number],
  startYear: Number,
  endYear: Number,
  ratingGte: Number,
  ratingLte: Number,
  rating: Number,
  page: Number,
  totalPages: Number
});

var RoomSchema = new mongoose.Schema(
  {
    id: String,
    state: { type: String, default: "WAITING_ROOM" },
    configurationByUser: { type: [String], default: [] },
    movies: {
      type: Object,
      default: {}
    },
    name: String,
    likes: Object,
    users: [{ id: String, name: String }],
    readies: { type: [String], default: [] },
    info: InfoSchema,
    matches: { type: [Number], default: [] }
  },
  { timestamps: true }
);

mongoose.model("Room", RoomSchema);
