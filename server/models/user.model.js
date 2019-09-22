var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  timestamps: {},
  id: String,
  name: String,
  googleId: String,
  email: String
});

mongoose.model("User", UserSchema);
