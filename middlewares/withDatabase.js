import mongoose from 'mongoose'
require('../server/models/genre.model')
require('../server/models/group.model')
require('../server/models/user.model')

const withDatabase = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) return handler(req, res)

    // Using new database connection
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })

    return handler(req, res)
}

export default withDatabase
