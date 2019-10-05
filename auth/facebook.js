const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const User = mongoose.model('User')

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_AUTH_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'email', 'name', 'displayName'],
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ facebookId: profile.id }, function(err, user) {
                if (err) {
                    return done(err)
                }

                if (user) {
                    return done(err, user)
                }

                if (!user) {
                    User.create(
                        {
                            facebookId: profile.id,
                            name: profile.displayName,
                            email:
                                profile.emails &&
                                profile.emails[0] &&
                                profile.emails[0].value,
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
