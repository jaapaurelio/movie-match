var mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    id: Number,
    usersLike: { type: [String], default: [] },
    usersDislike: { type: [String], default: [] },
    usersSeen: { type: [String], default: [] },
    usersRecomendation: { type: [String], default: [] },
    matched: { type: Boolean, default: false },
    title: String,
    original_title: String,
    poster_path: String,
    runtime: Number,
    genres: [{ id: Number, name: String }],
    release_date: String,
    vote_average: Number,
    original_language: String,
})

const InfoSchema = new mongoose.Schema({
    genres: [Number],
    startYear: Number,
    endYear: Number,
    ratingGte: Number,
    ratingLte: Number,
    rating: Number,
    page: Number,
    totalPages: Number,
})

var GroupSchema = new mongoose.Schema(
    {
        id: String,
        state: { type: String, default: 'WAITING_GROUP' },
        configurationByUser: { type: Object, default: {} },
        movies: {
            type: Object,
            default: {},
        },
        name: String,
        likes: Object,
        users: [{ id: String, name: String }],
        readies: { type: [String], default: [] },
        info: InfoSchema,
        bestMatch: { type: [Number], default: 0 },
        matches: { type: [Number], default: [] },
    },
    { timestamps: true, minimize: false }
)

mongoose.model('Group', GroupSchema)
