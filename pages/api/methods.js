import withMiddleware from '../../middlewares/withMiddleware'
import likeMethod from './_methods/like'
import createGroup from './_methods/create-group'
import user from './_methods/user'
import getGroup from './_methods/get-group'
import addMoviesToGroup from './_methods/add-movies-to-group'

const apiMethods = {
    like: likeMethod,
    'create-group': createGroup,
    user,
    'get-group': getGroup,
    'add-movies-to-group': addMoviesToGroup,
}

async function handle(req, res) {
    const apiMethod = req.query.api

    if (!apiMethods[apiMethod]) {
        console.error('No methods defined for', apiMethod)
    }

    return apiMethods[apiMethod](req, res)
}

export default withMiddleware(handle)
