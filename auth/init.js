var passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')

require('./google');
require('./facebook');

module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user._id)
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })
}
