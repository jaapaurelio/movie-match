import Topbar from "../components/topbar";
import MovieInfo from "../components/movie-info";
import Cast from "../components/cast";
import SwipeArea from "../components/swipe-area";
import axios from "axios";
import Pusher from "pusher-js";

const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

const getRandomMovie = function(movies) {
  var ids = Object.keys(movies);
  return movies[ids[(ids.length * Math.random()) << 0]];
};

const hasMaches = function(likes, nusers) {
  const values = Object.values(likes);
  return values.find(v => nusers === v);
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.noLike = this.noLike.bind(this);

    this.state = {
      movie: null,
      movies: null,
      loading: true,
      matched: false
    };
  }

  async getNewMovie(movies) {
    const movie = getRandomMovie(movies);

    if (!movie) {
      return this.setState({
        movie: null,
        movies: []
      });
    }

    delete movies[movie.id];

    this.setState({
      movie,
      movies
    });

    const movieInfo = await moviedb.movieInfo(movie.id, {
      append_to_response: "credits"
    });

    // Improve. Prevent add info to the wrong movie.
    if (this.state.movie.id === movieInfo.id) {
      this.setState({
        movie: { ...movie, ...movieInfo }
      });
    }
  }

  postLike(like) {
    const movieId = this.state.movie.id;
    axios.post(
      `api/groups/${this.props.roomId}/${this.state.userId}/${movieId}/${like}`
    );
  }

  like() {
    this.postLike(true);
    this.getNewMovie(this.state.movies);
    window.scrollTo(0, 0);
  }

  noLike() {
    this.postLike(false);

    this.getNewMovie(this.state.movies);
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true
    });

    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = new Date().getTime();
      localStorage.setItem("userId", userId);
    }

    this.setState({
      userId
    });

    this.channel = this.pusher.subscribe(`room-${this.props.roomId}`);

    this.channel.bind("movie-matched", movie => {
      this.setState({
        matched: true
      });
    });

    this.pusher.connection.bind("connected", async () => {
      console.log("pusher connected!");

      const moviesR = await axios.get(`/api/groups/${this.props.roomId}`);
      let { movies, group } = moviesR.data;
      console.log(moviesR.data);

      const matched = hasMaches(group.likes, group.numberOfUser);

      this.setState({
        loading: false,
        matched
      });

      if (!movies) {
        return;
      }

      movies = Object.keys(movies).reduce((acc, movieId) => {
        if (
          !group.movies[movieId] ||
          !group.movies[movieId].mm_stats.user_seen[userId]
        ) {
          acc[movieId] = movies[movieId];
        }

        return acc;
      }, {});

      console.log(movies);

      this.getNewMovie(movies);
    });
  }

  componentWillUnmount() {
    this.pusher.disconnect();
  }

  static getInitialProps({ query }) {
    return { roomId: query.id };
  }

  render() {
    const { movie } = this.state;
    return (
      <div>
        <Topbar
          activetab="room"
          roomId={this.props.roomId}
          title="Movie Match"
          matched={this.state.matched}
        />
        {movie && (
          <div>
            <SwipeArea>
              <MovieInfo movie={movie} />
              {movie.credits && <Cast cast={movie.credits.cast.slice(0, 5)} />}
            </SwipeArea>
            <div className="buttons-container-space" />
            <div className="buttons-container">
              <div onClick={this.noLike} className="button-choice button-no">
                Not today
              </div>
              <div onClick={this.like} className="button-choice button-yes">
                Yes please
              </div>
            </div>
          </div>
        )}

        {!movie && !this.state.loading && (
          <div className="mm-big-message">No more movies to show</div>
        )}
        {this.state.loading && (
          <div className="mm-big-message">Loading movies</div>
        )}

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
}

export default Index;
