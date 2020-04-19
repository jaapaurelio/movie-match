import withMiddleware from '../../middlewares/withMiddleware'
import likeMethod from '../../_methods/like'
import createGroup from '../../_methods/create-group'
import user from '../../_methods/user'
import getGroup from '../../_methods/get-group'
import addMoviesToGroup from '../../_methods/add-movies-to-group'
import setGroupReady from '../../_methods/set-group-ready'
import addMoviesConfiguration from '../../_methods/add-movies-configuration'
import Pusher from 'pusher'

const apiMethods = {
    like: likeMethod,
    'create-group': createGroup,
    user,
    'get-group': getGroup,
    'add-movies-to-group': addMoviesToGroup,
    'set-group-ready': setGroupReady,
    'add-movies-configuration': addMoviesConfiguration,
}

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
})

async function handle(req, res) {
    const apiMethod = req.query.api

    if (!apiMethods[apiMethod]) {
        console.error('No methods defined for', apiMethod)
    }

    return apiMethods[apiMethod](req, res, {pusher})
}

export default withMiddleware(handle)
