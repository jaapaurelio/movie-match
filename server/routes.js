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

router.post('/api/group/add-movies-configuration/:groupId')

router.post('/api/group/add-movies/:groupId', async (req, res) => {
    const { userId } = req.cookies
    const { groupId } = req.params
    const { movies, page, totalPages } = req.body

    let group = await Group.findOne({ id: groupId })

    await addMoviesToGroup(group, movies, userId)

    if (page) {
        group = await Group.findOneAndUpdate(
            { id: groupId },
            {
                [`configurationByUser.${userId}.page`]: page,
                [`configurationByUser.${userId}.totalPages`]: totalPages,
            },
            { new: true }
        )
    }

    group = await Group.findOne({ id: groupId })

    // send updated movies to clients
    const movieToSend = {}

    movies.forEach(movie => {
        movieToSend[movie.id] = group.movies[movie.id]
    })

    pusher.trigger(`group-${groupId}`, 'new-movies', movieToSend)

    return res.send({
        success: true,
    })
})

router.post('/api/group/:groupId/:movieId/:like')

module.exports = router
