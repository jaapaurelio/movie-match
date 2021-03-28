import mongoose from 'mongoose'
require('../models/genre.model')
require('../models/group.model')
require('../models/user.model')

const withDatabase = handler => async (...args) => {
    if (mongoose.connections[0].readyState) return handler(...args)
    console.log('tenta conectar', process.env.MONGODB_URI)
    // Using new database connection
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    console.log('sucess database')

    return handler(...args)
}

export default withDatabase
