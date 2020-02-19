var uniqid = require('uniqid')

const withUser = handler => async (req, res) => {
    if (!req.cookies.userId) {
        req.cookies.userId = uniqid()
    }
    res.cookie('userId', req.cookies.userId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
    })
    return handler(req, res)
}

export default withUser
