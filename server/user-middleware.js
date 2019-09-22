var uniqid = require('uniqid')

module.exports = function(req, res, next) {
    if (!req.cookies.userId) {
        req.cookies.userId = uniqid()
    }

    res.cookie('userId', req.cookies.userId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
    })

    next()
}
