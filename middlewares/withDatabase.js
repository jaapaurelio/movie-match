import mongoose from 'mongoose'
require('../models/genre.model')
require('../models/group.model')
require('../models/user.model')

const withDatabase = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) return handler(req, res)

    // Using new database connection
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })

    return handler(req, res)
}

export default withDatabase
