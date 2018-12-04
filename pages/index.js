import Topbar from "../components/topbar";
import MovieInfo from "../components/movie-info";
import SwipeArea from "../components/swipe-area";
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.noLike = this.noLike.bind(this);

    this.state = {
      id: 2
    };
  }

  getNewMovie() {
    this.setState({
      id: Math.floor(Math.random() * 20 + 1)
    });
  }

  like() {
    this.getNewMovie();
  }

  noLike() {
    this.getNewMovie();
  }

  render() {
    const { movies, id } = this.props;

    return (
      <div>
        <Topbar title="Movie Match" />
        <SwipeArea>
          <MovieInfo movie={movies[this.state.id]} />
        </SwipeArea>

        <div className="buttons-container-space" />
        <div className="buttons-container">
          <div>
            <div onClick={this.noLike} className="button-choice button-no">
              Not today
            </div>
            <div onClick={this.like} className="button-choice button-yes">
              Yes please
            </div>
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
              border-top: 1px solid #e8ebef;
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
              padding: 6px 20px;
              display: inline-block;
              margin: 20px;
              border-radius: 4px;
              color: #fff;
              text-transform: uppercase;
              font-size: 12px;
            }
          `}
        </style>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      id: Math.floor(Math.random() * 20 + 1)
    });
  }

  static async getInitialProps() {
    const genreList = await moviedb.genreMovieList();
    const genres = genreList.genres.reduce((acc, genre) => {
      acc[genre.id] = genre;
      return acc;
    }, {});

    const movieList = await moviedb.miscTopRatedMovies({
      append_to_response: "videos"
    });

    const movies = movieList.results.map(movie => ({
      ...movie,
      genres: movie.genre_ids.map(genreId => genres[genreId].name)
    }));

    return {
      movies
    };
  }
}

export default Index;
