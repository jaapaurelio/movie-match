import Topbar from '../components/topbar'
import MovieInfo from '../components/movie-info';
import SwipeArea from '../components/swipe-area';
const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('284941729ae99106f71e56126227659b')

const Index = (props) => (
    <div>
        <Topbar title="Movie Match" />
        <SwipeArea>
            <MovieInfo movie={props.movies.results[4]} />
        </SwipeArea>

        <style jsx>{`
        p {
            color: red;
        }
        `}
        </style>

    </div>
  )

  Index.getInitialProps = function() {
    return moviedb.miscTopRatedMovies().then(res => {
        return {
            movies: res
          }
      }).catch(console.error)
  }

  export default Index