import Topbar from "../components/topbar";
import MovieInfo from "../components/movie-info";
import Cast from "../components/cast";
import MatchPopup from "../components/match-popup";
import SwipeArea from "../components/swipe-area";
import Loader from "../components/loader";
import axios from "axios";
import Pusher from "pusher-js";
import Router from "next/router";
import PageWidth from "../components/page-width";
import RoomInfoBar from "../components/room-info-bar";
import shuffle from "shuffle-array";
import jsCookie from "js-cookie";

const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.noLike = this.noLike.bind(this);
    this.onClickMatches = this.onClickMatches.bind(this);
    this.onClickKeepPlaying = this.onClickKeepPlaying.bind(this);
    this.share = this.share.bind(this);

    this.state = {
      movie: null,
      movies: [],
      loading: true,
      matched: false,
      showMatchPopup: false,
      users: [],
      info: {},
      room: {},
      showShareButton: false
    };
  }

  async getNewMovie(movies) {
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

    // first movie has no data
    if (!movie.fullyLoaded) {
      const movieInfo = await moviedb.movieInfo(movie.id, {
        append_to_response: "credits"
      });

      if (this.state.movie && this.state.movie.id === movieInfo.id) {
        this.setState({
          movie: { ...this.state.movie, ...movieInfo, fullyLoaded: true }
        });
      }
    }

    const nextMovie = movies[movies.length - 1];

    if (!nextMovie) return;

    moviedb
      .movieInfo(nextMovie.id, {
        append_to_response: "credits"
      })
      .then(movie => {
        const nextMovies = this.state.movies;

        if (!movie) {
          return;
        }

        const movieIndex = nextMovies.findIndex(m => m.id == movie.id);

        nextMovies[movieIndex] = {
          ...nextMovies[movieIndex],
          ...movie,
          fullyLoaded: true
        };

        this.preloadImages(nextMovies[movieIndex]);

        this.setState({
          movies: nextMovies
        });
      });
  }

  postLike(like) {
    const movieId = this.state.movie.id;
    like = like ? "like" : "nolike";
    axios.post(`api/room/${this.props.roomId}/${movieId}/${like}`);
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

  share() {
    if (navigator.share) {
      const url = `${location.origin}/room?id=${this.props.roomId}`;
      navigator.share({
        title: "Movie Match",
        text: `Room ${this.props.roomId}`,
        url
      });
    }
  }

  componentDidMount() {
    if (navigator.share) {
      this.setState({ showShareButton: true });
    }

    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true
    });

    const userId = jsCookie.get("userId");

    this.channel = this.pusher.subscribe(`room-${this.props.roomId}`);

    this.channel.bind("movie-matched", matches => {
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

    this.channel.bind("new-movies", async movies => {
      movies = movies.filter(movie => {
        return !movie.usersSeen.includes(userId);
      });

      movies = shuffle(movies);
      movies = [...movies, ...this.state.movies];

      this.setState({
        movies
      });

      if (!this.state.movie) {
        this.getNewMovie(movies);
      }
    });

    this.pusher.connection.bind("connected", async () => {
      const moviesR = await axios.get(`/api/room/${this.props.roomId}`);
      let { room } = moviesR.data;

      if (!room) {
        return Router.push(`/start`);
      }

      const matched = room.matched;

      if (matched) {
        return Router.replace(`/matches?id=${this.props.roomId}`);
      }

      let movies = room.movies;

      this.setState({
        matched,
        users: room.users,
        info: {
          genres: room.info.genres,
          startYear: room.info.startYear,
          endYear: room.info.endYear
        },
        room
      });

      if (!movies) {
        return;
      }

      movies = movies.filter(movie => {
        return !movie.usersSeen.includes(userId);
      });

      movies = shuffle(movies);

      this.setState({ movies });

      await this.getNewMovie(movies);

      this.setState({
        loading: false
      });
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

  preloadImages(movie) {
    const poster = [
      `https://image.tmdb.org/t/p/w116_and_h174_bestv2/${movie.poster_path}`
    ];

    const cast = movie.credits.cast
      .slice(0, 5)
      .map(
        actor =>
          `https://image.tmdb.org/t/p/w240_and_h266_face/` + actor.profile_path
      );

    const toPreload = [...poster, ...cast];

    toPreload.map(src => {
      const image = new Image();
      image.src = src;
    });
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
          <RoomInfoBar
            shareBtn={this.share}
            showShare={this.state.showShareButton}
            users={this.state.users}
            room={this.state.room}
          />
        )}
        {this.state.users.length == 1 && (
          <div className="alone-msg">
            <PageWidth className="mm-content-padding">
              You're alone in the room. <br />
              Share with a friend to start matching.
            </PageWidth>
          </div>
        )}
        {movie && movie.fullyLoaded && (
          <div>
            <SwipeArea>
              <MovieInfo movie={movie} />
              <PageWidth>
                <Cast cast={movie.credits.cast.slice(0, 5)} />
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
        {this.state.loading && <Loader />}

        <PageWidth>
          {!movie && !this.state.loading && (
            <div className="mm-big-message">No more movies to show</div>
          )}
        </PageWidth>
        <MatchPopup
          show={showMatchPopup}
          onClickMatches={this.onClickMatches}
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

            .alone-msg {
              padding-top: 4px;
              padding-bottom: 4px;
              background: #a0e3ff;
              font-size: 12px;
              text-align: center;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Index;
