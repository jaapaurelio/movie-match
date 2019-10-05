var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    timestamps: {},
    id: String,
    name: String,
    googleId: String,
    facebookId: String,
    email: String,
})

mongoose.model('User', UserSchema)
