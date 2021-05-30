import withMiddleware from '../middlewares/withMiddleware'
const mongoose = require('mongoose')
const Group = mongoose.model('Group')
const randomstring = require('randomstring')

const generateGroupId = async function () {
    let groupExists = true
    let groupId

    while (groupExists) {
        groupId = randomstring.generate({
            length: 5,
            charset: 'alphabetic',
            readable: true,
            capitalization: 'uppercase',
        })

        groupExists = await Group.findOne({ id: groupId }).exec()
    }

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
