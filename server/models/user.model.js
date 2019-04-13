var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  timestamps: {},
  id: String,
  name: String
});

mongoose.model("User", UserSchema);
