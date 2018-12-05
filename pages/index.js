import Topbar from "../components/topbar";
import MovieInfo from "../components/movie-info";
import Cast from "../components/cast";
import SwipeArea from "../components/swipe-area";
import axios from "axios";
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.noLike = this.noLike.bind(this);

    this.state = {
      movie: null,
      movies: null
    };
  }

  async getNewMovie(movies = this.state.movies) {
    const movie = movies.pop();

    this.setState({
      movie,
      movies
    });

    const movieInfo = await moviedb.movieInfo(movie.id, {
      append_to_response: "credits"
    });
    this.setState({
      movie: { ...movie, ...movieInfo }
    });
  }

  like() {
    this.getNewMovie();
    window.scrollTo(0, 0);
  }

  noLike() {
    this.getNewMovie();
    window.scrollTo(0, 0);
  }

  render() {
    const { movie } = this.state;
    return (
      <div>
        <Topbar title="Movie Match" />
        {movie && (
          <SwipeArea>
            <MovieInfo movie={movie} />
            {movie.credits && <Cast cast={movie.credits.cast.slice(0, 5)} />}
          </SwipeArea>
        )}

        <div className="buttons-container-space" />
        <div className="buttons-container">
          <div onClick={this.noLike} className="button-choice button-no">
            Not today
          </div>
          <div onClick={this.like} className="button-choice button-yes">
            Yes please
          </div>
        </div>

        <style jsx>
          {`
            .buttons-container {
              position: fixed;
              bottom: 0;
              background: #f9fcff;
              left: 0;
              right: 0;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .buttons-container-space {
              margin-top: 100px;
            }

            .button-no {
              background: #ff565e;
              cursor: pointer;
            }

            .button-yes {
              background: #00e390;
              cursor: pointer;
            }

            .button-choice {
              user-select: none;
              padding: 15px 0;
              color: #fff;
              text-transform: uppercase;
              font-size: 12px;
              width: 50%;
              font-weight: bold;
            }
          `}
        </style>
      </div>
    );
  }

  async componentDidMount() {
    const moviesR = await axios.get("/api/groups/AAAA");
    let movies = moviesR.data.movies;

    movies = movies
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);

    this.getNewMovie(movies);
  }
}

export default Index;
