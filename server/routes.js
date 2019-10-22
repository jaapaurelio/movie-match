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

const generateGroupId = async function() {
    const groupIdsMap = await Group.find(
        {},
        {
            _id: 0,
            id: 1,
        }
    ).exec()
    const groupIds = groupIdsMap.map(r => r.id)

    do {
        groupId = randomstring.generate({
            length: 4,
            charset: 'alphabetic',
            readable: true,
            capitalization: 'uppercase',
        })
    } while (groupIds.some(id => groupId === id))

    return groupId
}

function addMoviesToGroup(group, movies, userId) {
    const groupId = group.id
    const wait = movies.map(movie => {
        if (group.movies[movie.id]) {
            return Group.findOneAndUpdate(
                { id: groupId },
                {
                    $push: {
                        [`movies.${movie.id}.usersRecomendation`]: userId,
                    },
                }
            )
        } else {
            return Group.findOneAndUpdate(
                { id: groupId },
                {
                    [`movies.${movie.id}`]: {
                        id: movie.id,
                        title: movie.title,
                        usersLike: [],
                        usersDislike: [],
                        usersSeen: [],
                        usersRecomendation: [userId],
                    },
                }
            )
        }
    })

    return Promise.all(wait)
}

router.post(
    '/api/group/add-movies-configuration/:groupId',
    async (req, res) => {
        const { userId } = req.cookies
        const { groupId } = req.params
        const { movies, config } = req.body

        let group = await Group.findOne({ id: groupId })

        if (!group || group.state !== GROUP_STATES.CONFIGURING) {
            return res.send({
                success: false,
                error: 'No group with this id in configuring phase',
            })
        }

        const userConfig = group.configurationByUser[userId]

        if (userConfig) {
            return res.send({
                success: false,
                error: 'User already with config for this group',
            })
        }

        await addMoviesToGroup(group, movies, userId)

        group = await Group.findOneAndUpdate(
            { id: groupId },
            {
                [`configurationByUser.${userId}`]: {
                    ...config,
                },
            },
            { new: true }
        )

        if (
            Object.keys(group.configurationByUser).length === group.users.length
        ) {
            group.state = GROUP_STATES.MATCHING

            await Group.findOneAndUpdate({ id: groupId }, group)

            pusher.trigger(`group-${groupId}`, 'configuration-done', {})
        }

        return res.send({
            success: true,
        })
    }
)

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

router.post('/api/group/:groupId/:movieId/:like', async (req, res) => {
    const { movieId, groupId } = req.params
    const { userId } = req.cookies
    const like = req.params.like === 'like'

    let group = await Group.findOne({ id: groupId }).exec()

    if (group.movies[movieId].usersSeen.find(u => u === userId)) {
        return res.send({
            success: false,
            message: 'User already set movie like',
        })
    }

    if (like) {
        group = await Group.findOneAndUpdate(
            { id: groupId },
            {
                $push: {
                    [`movies.${movieId}.usersLike`]: userId,
                    [`movies.${movieId}.usersSeen`]: userId,
                },
            },
            { new: true }
        )

        const movie = group.movies[movieId]

        if (
            group.users.length >= 2 &&
            movie.usersLike.length === group.users.length
        ) {
            group = await Group.findOneAndUpdate(
                { id: groupId },
                {
                    $push: {
                        matches: movieId,
                    },
                },
                { new: true }
            )

            pusher.trigger(`group-${groupId}`, 'movie-matched', {
                matches: group.matches,
            })

            return res.send({})
        }
    } else {
        group = await Group.findOneAndUpdate(
            { id: groupId },
            {
                $push: {
                    [`movies.${movieId}.usersDislike`]: userId,
                    [`movies.${movieId}.usersSeen`]: userId,
                },
            },
            { new: true }
        )
    }

    pusher.trigger(`group-${groupId}`, 'new-movies', [group.movies[movieId]])

    res.send({})
})

router.post('/api/user/', async (req, res) => {
    const userId = req.cookies.userId
    const name = req.body.name

    let query = { id: userId }
    let update = { id: userId, name }
    let options = { upsert: true, new: true, setDefaultsOnInsert: true }
    await User.findOneAndUpdate(query, update, options)

    return res.send({ success: true })
})

router.post('/api/create-group', async (req, res) => {
    const groupId = await generateGroupId()

    const group = new Group({
        id: groupId,
    })

    await group.save()

    return res.send({ success: true, groupId: groupId })
})

router.post('/api/group/ready/:groupId', async (req, res) => {
    const groupId = req.params.groupId
    const userId = req.cookies.userId
    let group = await Group.findOne({ id: groupId }).exec()

    if (!group || group.state !== GROUP_STATES.WAITING_GROUP) {
        return res.send({ success: false, message: 'Not not accepting users' })
    }

    const exists = group.readies.find(u => u === userId)

    if (exists) {
        return res.send({ success: true, message: 'Already in the group' })
    }

    group.readies.push(userId)

    group.save().then(async () => {
        group = await Group.findOne({ id: groupId }).exec()

        if (group.readies.length === group.users.length) {
            group.state = GROUP_STATES.CONFIGURING
            await group.save()
            pusher.trigger(`group-${groupId}`, 'group-ready', {})
        }
    })

    return res.send({ success: true })
})

router.get('/api/group/:groupId', async (req, res) => {
    const groupId = req.params.groupId
    const userId = req.cookies.userId

    const group = await Group.findOne({ id: groupId }).exec()

    if (!group) {
        return res.send({ message: 'No group' })
    }

    const user = await User.findOne({ id: userId }).exec()

    if (!user) {
        return res.send({ message: 'No user' })
    }

    const userInGroup = group.users.find(user => user.id === userId)

    if (group.state !== GROUP_STATES.WAITING_GROUP && !userInGroup) {
        return res.send({ message: 'User not in group' })
    }

    if (group.state === GROUP_STATES.WAITING_GROUP && !userInGroup) {
        group.users.push(user)
        await Group.findOneAndUpdate({ id: groupId }, group)
        pusher.trigger(`group-${groupId}`, 'users', group.users)
    }

    //group.matches = group.matches.slice(0, 3)

    res.cookie('groupId', groupId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
    })

    group.movies = group.movies

    res.send({ group })
})
module.exports = router
