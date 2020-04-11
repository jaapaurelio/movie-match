import withMiddleware from '../../../middlewares/withMiddleware'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')
const { GROUP_STATES } = require('../../../lib/constants')

const Pusher = require('pusher')

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
})

// todo remove duplication
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

async function handle(req, res) {
    const { userId } = req.cookies
    const { groupId } = req.query
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

    if (Object.keys(group.configurationByUser).length === group.users.length) {
        group.state = GROUP_STATES.MATCHING

        await Group.findOneAndUpdate({ id: groupId }, group)

        pusher.trigger(`group-${groupId}`, 'configuration-done', {})
    }

    return res.send({
        success: true,
    })
}

export default withMiddleware(handle)
