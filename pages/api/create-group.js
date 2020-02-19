import withMiddleware from '../../middlewares/withMiddleware'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')
const randomstring = require('randomstring')

const generateGroupId = async function() {
    const groupIdsMap = await Group.find(
        {},
        {
            _id: 0,
            id: 1,
        }
    ).exec()
    const groupIds = groupIdsMap.map(r => r.id)
    let groupId
    do {
        groupId = randomstring.generate({
            length: 4,
            charset: 'alphabetic',
            readable: true,
            capitalization: 'uppercase',
        })
    } while (groupIds.some(id => groupId === id))

    return groupId
}

async function handle(req, res) {
    const groupId = await generateGroupId()

    const group = new Group({
        id: groupId,
    })

    await group.save()

    return res.send({ success: true, groupId: groupId })
}

export default withMiddleware(handle)
