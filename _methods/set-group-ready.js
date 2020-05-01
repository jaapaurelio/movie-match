import withMiddleware from '../middlewares/withMiddleware'
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
    pusher.trigger(`group-${groupId}`, 'group-tes2', {'aaa':'aa'})

    group = await group.save()

    pusher.trigger(`group-${groupId}`, 'group-tes3', {'aaa':'aa'})

    group = await Group.findOne({ id: groupId }).exec()
    pusher.trigger(`group-${groupId}`, 'group-tes4', {'aaa':'aa'})

    if (group.readies.length === group.users.length) {
        pusher.trigger(`group-${groupId}`, 'group-tes5', {'aaa':'aa'})

        console.log('group ready', `group-${groupId}`)
        group.state = GROUP_STATES.CONFIGURING

        pusher.trigger(`group-${groupId}`, 'group-ready', {success: true})

        group = await group.save()
        console.log('send push trigger', pusher.trigger)
    }
    pusher.trigger(`group-${groupId}`, 'group-tes6', {'aaa':'aa'})

    return res.send({ success: true, group })
}

export default withMiddleware(handle)
