import mongoose from 'mongoose'
require('../models/genre.model')
require('../models/group.model')
require('../models/user.model')

let id = 0
let isConnected

const withDatabase = (handler) => async (...args) => {
    console.log('withDatabase- withdatabase')
    id++
    console.log('number of times reused', id)

    if (isConnected) {
        console.log('=> using existing database connection')
        return handler(...args)
    }

    console.log('withDatabase- tenta conectar', process.env.MONGODB_URI)
    // Using new database connection
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })

    isConnected = mongoose.connections[0].readyState
    console.log('withDatabase- success database')

    return handler(...args)
}

export default withDatabase
