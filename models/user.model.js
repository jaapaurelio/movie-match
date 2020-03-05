var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    timestamps: {},
    id: String,
    name: String,
    googleId: String,
    facebookId: String,
    email: String,
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
