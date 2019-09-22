var passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')

require('./google');
require('./facebook');

module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user)
    })

    passport.deserializeUser(function(user, done) {
        done(null, user)
    })
}
