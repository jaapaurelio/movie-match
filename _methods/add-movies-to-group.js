import withMiddleware from '../middlewares/withMiddleware'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')

const Pusher = require('pusher')

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
})

// todo remove replication
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
}

export default withMiddleware(handle)
