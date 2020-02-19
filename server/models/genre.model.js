var mongoose = require('mongoose')

var GenreSchema = new mongoose.Schema({
    id: Number,
    name: String,
})

export default mongoose.models.Genre || mongoose.model('Genre', GenreSchema)
