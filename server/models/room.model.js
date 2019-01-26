var mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  usersLike: [String],
  usersSeen: [String],
  matched: { type: Boolean, default: false }
});

const InfoSchema = new mongoose.Schema({
  genres: [{ id: Number, name: String }],
  startYear: Number,
  endYear: Number,
  ratingGte: Number,
  ratingLte: Number
});

var RoomSchema = new mongoose.Schema({
  id: String,
  movies: [MovieSchema],
  name: String,
  likes: Object,
  users: [String],
  info: InfoSchema
});

mongoose.model("Room", RoomSchema);
