import withMiddleware from '../middlewares/withMiddleware'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')

const { GROUP_STATES } = require('../lib/constants')
const Pusher = require('pusher')

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
})

async function handle(req, res) {
    const groupId = req.query.groupId
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

        return res.send({ success: true, group })
    })
}

export default withMiddleware(handle)
