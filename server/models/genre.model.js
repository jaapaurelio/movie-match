var mongoose = require("mongoose");

var GenreSchema = new mongoose.Schema({
  id: Number,
  name: String
});

mongoose.model("Genre", GenreSchema);
