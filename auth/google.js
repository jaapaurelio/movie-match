const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const mongoose = require('mongoose')
const User = mongoose.model('User')

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ googleId: profile.id }, function(err, user) {
                if (err) {
                    return done(err)
                }

                if (user) {
                    return done(err, user)
                }

                if (!user) {
                    User.create(
                        {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        },
                        function(err, user) {
                            return done(err, user)
                        }
                    )
                }
            })
        }
    )
)
