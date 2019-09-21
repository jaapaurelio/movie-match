import * as _ from 'lodash'

function removeMatchedMovies(movies) {
    return movies.filter(movie => {
        return !movie.matched
    })
}

function removeSeenMovies(movies, userId) {
    return movies.filter(movie => {
        return !movie.usersSeen.includes(userId)
    })
}

function countUserRecomendation(movie, userId) {
    return movie.usersRecomendation.filter(user => {
        return user === userId
    }).length
}

function createPoints(movies, userId) {
    return movies.map(movie => {
        let points = 0

        if (movie.usersLike.length) {
            points = points + 100
        }

        const userRecomendadions = countUserRecomendation(movie, userId)
        const allRecomensations = movie.usersRecomendation.length

        points = points + userRecomendadions * 2 + allRecomensations
        movie.points = points

        return movie
    })
}

function convertToList(movies) {
    return Object.keys(movies).map(movieId => movies[movieId])
}

function removeCurrentMovie(movies, currentMovie) {
    if (!currentMovie) {
        return movies
    }
    return movies.filter(movie => movie.id !== currentMovie.id)
}

export const sortMovies = (moviesObject, userId, currentMovie) => {
    let movies = convertToList(moviesObject)
    movies = removeCurrentMovie(movies, currentMovie)
    movies = removeMatchedMovies(movies)
    movies = removeSeenMovies(movies, userId)
    movies = createPoints(movies, userId)

    movies = _.sortBy(movies, function(movie) {
        return -movie.points
    })

    return movies
}
