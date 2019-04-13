import Topbar from "../components/topbar";
import MovieInfo from "../components/movie-info";
import Cast from "../components/cast";
import MatchPopup from "../components/match-popup";
import SwipeArea from "../components/swipe-area";
import Loader from "../components/loader";
import axios from "axios";
import Router from "next/router";
import PageWidth from "../components/page-width";
import RoomInfoBar from "../components/room-info-bar";
import shuffle from "shuffle-array";
import jsCookie from "js-cookie";
import { ROOM_STATES } from "../lib/constants";
import { pusherConnection } from "../lib/pusher-connection";
import validateRoom from "../lib/room-redirect";
import UserPop from "../components/user-popup";
import { withNamespaces } from "../i18n";

const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.noLike = this.noLike.bind(this);
    this.onClickMatches = this.onClickMatches.bind(this);
    this.share = this.share.bind(this);
    this.addMoreLikeThis = this.addMoreLikeThis.bind(this);

    this.state = {
      movie: null,
      movies: [],
      loading: true,
      matched: false,
      showMatchPopup: false,
      users: [],
      info: {},
      room: {},
      showShareButton: false,
      showAddMoreBtn: true,
      loaded: false
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
      movies,
      showAddMoreBtn: true
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

  addMoreLikeThis() {
    this.setState({
      showAddMoreBtn: false
    });

    axios.post(`api/room/similar/${this.props.roomId}/${this.state.movie.id}`);
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

  async componentDidMount() {
    if (navigator.share) {
      this.setState({ showShareButton: true });
    }

    const moviesR = await axios.get(`/api/room/${this.props.roomId}`);
    let { room } = moviesR.data;

    if (!validateRoom(room, ROOM_STATES.MATCHING)) {
      return;
    }

    this.setState({
      loaded: true
    });

    this.pusher = pusherConnection();

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

    const matched = room.state === ROOM_STATES.MATCHED;
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
  }

  componentWillUnmount() {
    if (this.pusher) {
      this.pusher.unsubscribe(`room-${this.props.roomId}`);
    }
  }

  onClickMatches() {
    this.setState({ showMatchPopup: false });
    Router.push(`/matches?id=${this.props.roomId}`);
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
    const TopBarForPage = (
      <Topbar roomPage={true} activetab="room" roomId={this.props.roomId} />
    );

    if (!this.state.loaded) {
      return (
        <div>
          {TopBarForPage}
          <Loader />
          <UserPop />
        </div>
      );
    }

    return (
      <div>
        {TopBarForPage}
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
              {this.props.t("you-are-alone-room")}
              <br />
              {this.props.t("mm-better-with-friends")}
              <br />
              {this.props.t("no-matches-will-be-done")}
            </PageWidth>
          </div>
        )}
        {movie && movie.fullyLoaded && (
          <div>
            <SwipeArea>
              <MovieInfo
                movie={movie}
                showAddMoreBtn={this.state.showAddMoreBtn}
                onClickAddMore={this.addMoreLikeThis}
              />
              <PageWidth>
                <Cast t={this.props.t} cast={movie.credits.cast.slice(0, 5)} />
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
                    {this.props.t("not-today-btn")}
                  </div>
                  <div onClick={this.like} className="button-choice button-yes">
                    {this.props.t("yes-btn")}
                  </div>
                </div>
              </PageWidth>
            </div>
          </div>
        )}
        {this.state.loading && <Loader />}

        <PageWidth>
          {!movie && !this.state.loading && (
            <div className="mm-big-message">
              {this.props.t("no-more-movies-to-show")}
            </div>
          )}
        </PageWidth>
        <MatchPopup
          show={showMatchPopup}
          onClickMatches={this.onClickMatches}
        />

        <style jsx>
          {`
            .share-btn {
              width: auto;
              padding: 2px 4px;
              border: 0;
              border: 1px solid #fedc6e;
              color: #333;
              border-radius: 4px;
              font-size: 12px;
              flex-shrink: 0;
              margin-bottom: 0px;
              margin-top: 6px;
            }

            .room-code-alone {
              margin-top: 6px;
              font-weight: bold;
            }

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
              padding-top: 6px;
              padding-bottom: 6px;
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

export default withNamespaces("common")(Index);
