var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  id: String,
  name: String
});

mongoose.model("User", UserSchema);
