import withMiddleware from '../../../middlewares/withMiddleware'
const mongoose = require('mongoose')
const User = mongoose.model('User')

async function handle(req, res) {
    const userId = req.cookies.userId
    const name = req.body.name

    let query = { id: userId }
    let update = { id: userId, name }
    let options = { upsert: true, new: true, setDefaultsOnInsert: true }
    await User.findOneAndUpdate(query, update, options)

    return res.send({ success: true })
}

export default withMiddleware(handle)
