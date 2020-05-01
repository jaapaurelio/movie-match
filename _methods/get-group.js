import withMiddleware from '../middlewares/withMiddleware'
import { pusherTrigger }from '../lib/pusher-promisify'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')
const User = mongoose.model('User')
const { GROUP_STATES } = require('../lib/constants')

function sortMostLiked(movies, numUsers, bestMatch) {
    const movieIds = Object.keys(movies)
    if (!movieIds) {
        return []
    }

    const a = movieIds
        .map(movieId => {
            return movies[movieId]
        })
        .filter(function(movie) {
            return (
                calculatePercentage(movie.usersLike.length, numUsers) ==
                bestMatch
            )
        })

    return a
}

function calculatePercentage(numOfLikes, totalUsers) {
    return Math.round((numOfLikes / totalUsers) * 100)
}

async function handle(req, res, {pusher}) {
    const groupId = req.query.groupId
    const userId = req.cookies.userId

    let group = await Group.findOne({ id: groupId }).exec()

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
        group = await Group.findOneAndUpdate(
            { id: groupId },
            {
                $push: {
                    [`users`]: user,
                },
            },
            { new: true }
        )
        
        pusherTrigger(pusher, `group-${groupId}`, 'users', group.users)

    }

    res.cookie('groupId', groupId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
    })

    let matches = []

    if (
        group.state === GROUP_STATES.MATCHING ||
        group.state === GROUP_STATES.MATCHED
    ) {
        matches = sortMostLiked(
            group.movies,
            group.users.length,
            group.bestMatch
        )
    }

    res.send({ group: { ...group.toJSON(), matches } })
}

export default withMiddleware(handle)
