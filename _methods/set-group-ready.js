import withMiddleware from '../middlewares/withMiddleware'
import { pusherTrigger }from '../lib/pusher-promisify'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')

const { GROUP_STATES } = require('../lib/constants')

async function handle(req, res, {pusher}) {
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

    group = await group.save()

    group = await Group.findOne({ id: groupId }).exec()

    if (group.readies.length === group.users.length) {
        group.state = GROUP_STATES.CONFIGURING

        await pusherTrigger(pusher, `group-${groupId}`, 'group-ready', {success: true})

        group = await group.save()
    }

    return res.send({ success: true, group })
}

export default withMiddleware(handle)
