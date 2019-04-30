import Topbar from "../components/topbar";
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");
import axios from "axios";
import Router from "next/router";
import PageWidth from "../components/page-width";
import Headline from "../components/headline";
import RoomNumber from "../components/room-number";
import { pusherConnection } from "../lib/pusher-connection";
import validateRoom from "../lib/room-redirect";
import { ROOM_STATES } from "../lib/constants";
import Loader from "../components/loader";
import UserPop from "../components/user-popup";
import jsCookie from "js-cookie";
import { withNamespaces } from "../i18n";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);

    const years = [];
    for (let i = 1950; i <= 2020; i = i + 10) {
      years.push(i);
    }

    // TODO Make it smart
    years[years.length - 1] = 2019;

    const ratings = [
      { id: 0, label: this.props.t("bad-movies") },
      { id: 1, label: this.props.t("good-movies") }
    ];

    this.state = {
      genres: [],
      allSelected: false,
      errorMessages: [],
      startYear: 2000,
      endYear: 2019,
      rating: 1,
      waitingUsers: false,
      loaded: false
    };

    this.CONST = {
      years,
      ratings
    };

    this.toggleGenre = this.toggleGenre.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.showErrors = this.showErrors.bind(this);
  }

  submitForm() {
    const selectedGenres = this.state.genres
      .filter(genre => genre.selected)
      .map(genre => genre.id);

    const errorMessages = [];

    if (this.state.startYear >= this.state.endYear) {
      errorMessages.push(this.props.t("invalid-years"));
    }

    if (!selectedGenres.length) {
      errorMessages.push(this.props.t("please-select-genre"));
    }

    if (errorMessages.length > 0) {
      return this.showErrors(errorMessages);
    }

    this.createRoom({
      selectedGenres,
      startYear: this.state.startYear,
      endYear: this.state.endYear,
      rating: this.state.rating
    });
  }

  showErrors(errorMessages) {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
      this.errorTimer = null;
    }

    this.errorTimer = setTimeout(() => {
      this.setState({ errorMessages: [] });
      this.errorTimer = null;
    }, 2000);

    this.setState({
      errorMessages
    });
  }

  async createRoom({ selectedGenres, startYear, endYear, rating }) {
    const roomId = this.props.roomId;
    let ratingGte = 1;
    let ratingLte = 10;

    if (rating == 0) {
      ratingLte = 6;
    }

    if (rating == 1) {
      ratingGte = 7;
    }

    const baseQuery = {
      "vote_count.gte": 500,
      "primary_release_date.gte": `${startYear}-01-01`,
      "primary_release_date.lte": `${endYear}-12-30`,
      "vote_average.gte": ratingGte,
      "vote_average.lte": ratingLte,
      with_genres: selectedGenres.join("|")
    };

    this.setState({ waitingUsers: true });

    const moviesListResponse = await moviedb.discoverMovie({
      ...baseQuery,
      page: 1
    });

    const movies = moviesListResponse.results.map(movie => {
      return {
        id: movie.id,
        title: movie.title
      };
    });

    axios.post(`/api/room/add-movies-configuration/${roomId}`, {
      movies,
      config: {
        ratingLte,
        ratingGte,
        startYear,
        endYear,
        selectedGenres,
        page: 1,
        totalPages: moviesListResponse.total_pages
      }
    });
  }

  toggleGenre(id) {
    const genres = this.state.genres.map(genre => {
      if (genre.id === id) {
        return {
          ...genre,
          selected: !genre.selected
        };
      }

      return genre;
    });

    this.setState({ genres });
  }

  async componentDidMount() {
    const userId = jsCookie.get("userId");
    const roomR = await axios.get(`/api/room/${this.props.roomId}`);

    let { room } = roomR.data;

    if (!validateRoom(room, ROOM_STATES.CONFIGURING)) {
      return;
    }

    this.setState({
      loaded: true
    });

    const userHasConfig = room.configurationByUser[userId];

    if (userHasConfig) {
      return this.setState({
        waitingUsers: true
      });
    }

    this.pusher = pusherConnection();

    this.channel = this.pusher.subscribe(`room-${this.props.roomId}`);

    this.channel.bind("configuration-done", () => {
      this.setState({ loaded: false });
      Router.push(`/room?id=${this.props.roomId}`);
    });
  }

  componentWillUnmount() {
    if (this.pusher) {
      this.pusher.unsubscribe(`room-${this.props.roomId}`);
    }
  }
  componentWillMount() {
    const genres = this.props.genres;
    this.setState({ genres });
  }

  static async getInitialProps({ query }) {
    const roomId = query.id && query.id.toUpperCase();
    const genreMovieList = await moviedb.genreMovieList();

    const genres = genreMovieList.genres.map(genre => ({
      ...genre,
      selected: false
    }));

    return { genres, namespacesRequired: ["common"], roomId };
  }

  render() {
    const TopBarForPage = <Topbar showMenu={false} />;

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
      <div className="root-container">
        <Topbar newRoomPage={true} />
        {!this.state.waitingUsers && (
          <div>
            <Headline className="description-container">
              {this.props.t("what-kind-of-movie-you-like")}
            </Headline>
            <PageWidth>
              <div className="mm-content-padding">
                <div className="form-title">{this.props.t("movie-genres")}</div>
                <div className="genres-container">
                  {this.state.genres.map(genre => {
                    return (
                      <div key={genre.id} className="checkbox-m">
                        <label
                          className={genre.selected ? "selected" : ""}
                          onClick={() => this.toggleGenre(genre.id)}
                        >
                          {genre.name}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="form-title">{this.props.t("rating")}</div>
                <div className="two-selects-row">
                  <select
                    className="select-m"
                    defaultValue={this.state.rating}
                    onChange={event => {
                      this.setState({ rating: event.target.value });
                    }}
                  >
                    {this.CONST.ratings.map((rating, i) => {
                      return (
                        <option key={rating.id} value={rating.id}>
                          {rating.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-title">{this.props.t("from-year")}</div>
                <div className="two-selects-row">
                  <select
                    className="select-m"
                    defaultValue={this.state.startYear}
                    onChange={event => {
                      this.setState({ startYear: event.target.value });
                    }}
                  >
                    {this.CONST.years.map((year, i) => {
                      return (
                        <option key={i} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                  <span className="two-to">{this.props.t("to")}</span>
                  <select
                    className="select-m"
                    defaultValue={this.state.endYear}
                    onChange={event => {
                      this.setState({ endYear: event.target.value });
                    }}
                  >
                    {this.CONST.years.map((year, i) => {
                      return (
                        <option key={i} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {!!this.state.errorMessages.length && (
                  <div className="toast-error-container">
                    <div className="toast-error">
                      {this.state.errorMessages.map(message => (
                        <span key={message}>
                          {message} <br />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="create-room-btn-container">
                  <button
                    onClick={this.submitForm}
                    className="mm-btn create-room-btn"
                  >
                    {this.props.t("next-btn")}
                  </button>
                </div>
              </div>
            </PageWidth>
          </div>
        )}

        {this.state.waitingUsers && (
          <div className="waiting-users-container">
            <PageWidth>
              <RoomNumber roomId={this.props.roomId} />
              <div className="waiting-title">
                {this.props.t("waiting-for-friends-config")}
              </div>
            </PageWidth>
          </div>
        )}

        <style jsx>
          {`
            .waiting-users-container {
              padding-top: 20px;
            }
            .waiting-title {
              margin-top: 10px;
              padding: 20px;
              text-align: center;
            }
            .container {
              padding: 0 10px;
            }

            .description-container {
              margin-bottom: 20px;
            }

            .description {
              padding: 20px;
            }

            .form-title {
              font-size: 16px;
              margin: 20px 0 10px;
            }

            .two-selects-row {
              display: flex;
              justify-content: center;
              flex-direction: row;
              align-items: center;
            }

            .two-to {
              padding: 0 10px;
            }

            .select-m {
              width: 100%;
              padding: 10px;
              box-sizing: border-box;
              font-size: 14px;
              color: #333;
            }

            .genres-container {
              display: flex;
              flex-wrap: wrap;
            }

            .checkbox-m {
              display: inline-block;
              user-select: none;
              box-sizing: content-box;
              flex: 1 1 auto;
            }

            .select-all {
              width: 100%;
              text-align: center;
            }

            .checkbox-m input {
              position: absolute;
              left: -9999px;
            }

            .checkbox-m label {
              padding: 10px;
              border: 1px solid #b7b7b7;
              border-radius: 4px;
              font-size: 14px;
              cursor: pointer;
              display: block;
              margin: 4px;
              background: #fff;
            }

            .checkbox-m label.selected {
              background: #fff5bc;
              border-color: #f3e077;
            }

            .create-room-btn-container {
              text-align: right;
            }

            .create-room-btn {
              margin: 40px 0;
              width: 100%;
            }

            .toast-error-container {
              position: fixed;
              z-index: 2;
              top: 50px;
              left: 0;
              right: 0;
              justify-content: center;
              align-items: center;
              display: flex;
            }

            .toast-error {
              background: #f78a88;
              color: #fff;
              font-size: 12px;
              padding: 10px;
              border-radius: 4px;
              text-align: center;
              box-sizing: content-box;
              width: 80%;
            }
          `}
        </style>
      </div>
    );
  }
}

export default withNamespaces("common")(CreateRoom);
