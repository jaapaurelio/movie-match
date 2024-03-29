import withMiddleware from '../middlewares/withMiddleware'
import { pusherTrigger }from '../lib/pusher-promisify'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')

function calculatePercentage(numOfLikes, totalUsers) {
    return Math.round((numOfLikes / totalUsers) * 100)
}

async function handle(req, res, {pusher}) {
    const { movieId, groupId } = req.query
    const { userId } = req.cookies
    const like = req.query.like === 'like'

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

        const numOfLikes = group.movies[movieId].usersLike.length
        const percentage = calculatePercentage(numOfLikes, group.users.length)

        if (
            group.users.length >= 2 &&
            percentage > 50 &&
            percentage > group.bestMatch
        ) {
            group = await Group.findOneAndUpdate(
                { id: groupId },
                { bestMatch: percentage },
                { new: true }
            )

            await pusherTrigger(pusher, `group-${groupId}`, 'best-match-updated', percentage)

        }

        const movie = group.movies[movieId]

        if (movie.usersLike.length === group.users.length) {
            group = await Group.findOneAndUpdate(
                { id: groupId },
                {
                    $push: {
                        matches: movieId,
                    },
                },
                { new: true }
            )

            if (group.users.length >= 2) {
                await pusherTrigger(pusher, `group-${groupId}`, 'movie-matched', {
                    matches: group.matches,
                })
            }
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

    await pusherTrigger(pusher, `group-${groupId}`, 'new-movies', [group.movies[movieId]])

    res.send({})
}

export default withMiddleware(handle)
