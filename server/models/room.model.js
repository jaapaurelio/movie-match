var mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  id: Number,
  usersLike: [String],
  usersSeen: [String],
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

var RoomSchema = new mongoose.Schema({
  timestamps: {},
  id: String,
  state: { type: String, default: "WAITING_ROOM" },
  configurationByUser: { type: [Object], default: [] },
  movies: [MovieSchema],
  name: String,
  likes: Object,
  users: [Object],
  readies: { type: [String], default: [] },
  info: InfoSchema,
  matches: { type: [Number], default: [] }
});

mongoose.model("Room", RoomSchema);
