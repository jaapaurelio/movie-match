const router = require('express').Router()
const dc = require('./movie-lists/dark-comedy')
const bbr = require('./movie-lists/badass-bank-robbers')

router.get('/api/movie-lists', async (req, res) => {
    const movieLists = [dc, bbr]
    return res.send({ success: true, movieLists })
})

module.exports = router
