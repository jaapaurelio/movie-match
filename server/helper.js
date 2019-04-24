function convertMoviesToList(movies) {
  return Object.keys(movies).map(movieId => movies[movieId]);
}

module.exports = {
  convertMoviesToList
};
