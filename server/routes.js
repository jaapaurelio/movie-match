const router = require('express').Router()
const Pusher = require('pusher')
const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('284941729ae99106f71e56126227659b')
const randomstring = require('randomstring')
const mongoose = require('mongoose')
const Genre = mongoose.model('Genre')
const Group = mongoose.model('Group')
const User = mongoose.model('User')
const shuffle = require('shuffle-array')
const { GROUP_STATES } = require('../lib/constants')

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
})

router.post('/api/group/add-movies/:groupId', async (req, res) => )

router.post('/api/group/:groupId/:movieId/:like')

module.exports = router
