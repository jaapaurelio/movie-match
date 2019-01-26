import Topbar from "../components/topbar";
import MovieInfo from "../components/movie-info";
import Cast from "../components/cast";
import MatchPopup from "../components/match-popup";
import SwipeArea from "../components/swipe-area";
import axios from "axios";
import Pusher from "pusher-js";
import Router from "next/router";
import PageWidth from "../components/page-width";
import shuffle from "shuffle-array";
import jsCookie from "js-cookie";

const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

const hasMaches = function(movies, nusers) {
  return movies.find(movie => movie.usersLike === nusers);
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.noLike = this.noLike.bind(this);
    this.onClickMatches = this.onClickMatches.bind(this);
    this.onClickKeepPlaying = this.onClickKeepPlaying.bind(this);

    this.state = {
      movie: null,
      movies: null,
      loading: true,
      matched: false,
      showMatchPopup: false,
      users: [],
      info: {}
    };
  }

  async getNewMovie() {
    const movies = this.state.movies;

    const movie = movies.pop();

    if (!movie) {
      return this.setState({
        movie: null,
        movies: []
      });
    }

    this.setState({
      movie,
      movies
    });

    if (!movie.vote_count) {
      const movieInfo = await moviedb.movieInfo(movie.id, {
        append_to_response: "credits"
      });

      if (this.state.movie.id === movieInfo.id) {
        this.setState({
          movie: { ...this.state.movie, ...movieInfo }
        });
      }
    }

    const nextMovie = this.state.movies[this.state.movies.length - 1];

    if (!nextMovie) return;

    moviedb
      .movieInfo(nextMovie.id, {
        append_to_response: "credits"
      })
      .then(movie => {
        const nextMovies = this.state.movies;
        if (nextMovies[nextMovies.length - 1].id === movie.id) {
          nextMovies[nextMovies.length - 1] = movie;
          this.setState({
            movies: nextMovies
          });
        }
      });
  }

  postLike(like) {
    const movieId = this.state.movie.id;
    like = like ? "like" : "nolike";
    axios.post(`api/room/${this.props.roomId}/${movieId}/${like}`);
  }

  like() {
    this.postLike(true);
    this.getNewMovie();
    window.scrollTo(0, 0);
  }

  noLike() {
    this.postLike(false);

    this.getNewMovie();
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true
    });

    const userId = jsCookie.get("userId");
    console.log("userId", userId);

    this.channel = this.pusher.subscribe(`room-${this.props.roomId}`);

    this.channel.bind("movie-matched", movie => {
      this.setState({
        matched: true,
        showMatchPopup: true
      });
    });

    this.channel.bind("users", users => {
      this.setState({
        users
      });
    });

    this.pusher.connection.bind("connected", async () => {
      const moviesR = await axios.get(`/api/room/${this.props.roomId}`);
      let { room } = moviesR.data;

      if (!room) {
        return Router.push(`/start`);
      }

      let movies = room.movies;

      const matched = hasMaches(room.movies, room.numberOfUser);

      this.setState({
        loading: false,
        matched,
        users: room.users,
        info: {
          genres: room.info.genres,
          startYear: room.info.startYear,
          endYear: room.info.endYear
        }
      });

      if (!movies) {
        return;
      }

      movies = movies.filter(movie => {
        return !movie.usersSeen.includes(userId);
      });

      movies = shuffle(movies);

      this.setState({ movies });

      this.getNewMovie();
    });
  }

  componentWillUnmount() {
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }

  onClickMatches() {
    this.setState({ showMatchPopup: false });
    Router.push(`/matches?id=${this.props.roomId}`);
  }

  onClickKeepPlaying() {
    this.setState({ showMatchPopup: false });
  }

  static async getInitialProps({ query }) {
    const roomId = query.id && query.id.toUpperCase();
    return { roomId, namespacesRequired: ["common"] };
  }

  render() {
    const { movie, showMatchPopup } = this.state;
    return (
      <div>
        <Topbar roomPage={true} activetab="room" roomId={this.props.roomId} />
        {this.state.info.genres && (
          <div className="room-info">
            <PageWidth className="mm-content-padding">
              <div className="eli">
                <i className="fas fa-user room-info-icon" />
                <span className="room-info-text">
                  {this.state.users.length}
                </span>
                <i className="fas fa-info-circle room-info-icon" />
                {this.state.info.startYear}-{this.state.info.endYear}&nbsp;
                {this.state.info.genres.map(g => g.name + ", ")}
              </div>
            </PageWidth>
          </div>
        )}
        {movie && movie.credits && (
          <div>
            <SwipeArea>
              <MovieInfo movie={movie} />
              <PageWidth>
                {movie.credits && (
                  <Cast cast={movie.credits.cast.slice(0, 5)} />
                )}
              </PageWidth>
            </SwipeArea>
            <div className="buttons-container-space" />
            <div className="buttons-container-bg">
              <PageWidth>
                <div className="buttons-container">
                  <div
                    onClick={this.noLike}
                    className="button-choice button-no"
                  >
                    Not today
                  </div>
                  <div onClick={this.like} className="button-choice button-yes">
                    Yes
                  </div>
                </div>
              </PageWidth>
            </div>
          </div>
        )}
        <PageWidth>
          {!movie && !this.state.loading && (
            <div className="mm-big-message">No more movies to show</div>
          )}
          {this.state.loading && (
            <div className="mm-big-message">Loading movies</div>
          )}
        </PageWidth>
        <MatchPopup
          show={showMatchPopup}
          onClickMatches={this.onClickMatches}
          onClickKeepPlaying={this.onClickKeepPlaying}
        />

        <style jsx>
          {`
            .room-id {
              background: #333333;
              color: #72a3b3;
              text-align: center;
              font-size: 11px;
              padding-bottom: 10px;
              font-weight: bold;
            }

            .room-info {
              background: #424242;
              color: #fff;
              font-size: 12px;
              text-align: center;
              padding: 10px 0;
            }

            .eli {
              white-space: nowrap;
              overflow: hidden;
            }

            .room-info-icon {
              margin-right: 4px;
            }

            .room-info-text {
              margin-right: 10px;
            }

            .buttons-container-bg {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
            }

            .buttons-container {
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px;
            }

            .buttons-container-space {
              margin-top: 100px;
            }

            .button-no {
              background: #333;
              cursor: pointer;
              margin-right: 2px;
            }

            .button-yes {
              background: #06baa8;
              cursor: pointer;
              margin-left: 2px;
            }

            .button-choice {
              user-select: none;
              padding: 15px 0;
              color: #fff;
              text-transform: uppercase;
              font-size: 12px;
              width: 50%;
              font-weight: bold;
              border-radius: 4px;
              box-shadow: 0px 1px 2px 0px #00000094;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Index;
