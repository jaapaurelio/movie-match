import Topbar from "../components/topbar";
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");
import axios from "axios";
import Router from "next/router";
import PageWidth from "../components/page-width";
import Headline from "../components/headline";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);

    const years = [];
    for (let i = 1900; i <= 2019; i++) {
      years.push(i);
    }

    const ratings = [
      { id: 0, label: "Bad movies" },
      { id: 1, label: "Good movies" },
      { id: 2, label: "Best movies" }
    ];

    this.state = {
      genres: [],
      allSelected: false,
      errorMessages: [],
      startYear: 2000,
      endYear: 2019,
      rating: 2,
      creatingRoom: false
    };

    this.CONST = {
      years,
      ratings
    };

    this.toggleGenre = this.toggleGenre.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.showErrors = this.showErrors.bind(this);
    this.backbtn = this.backbtn.bind(this);
  }

  submitForm() {
    const selectedGenres = this.state.genres
      .filter(genre => genre.selected)
      .map(genre => genre.id);

    const errorMessages = [];

    if (this.state.startYear > this.state.endYear) {
      errorMessages.push("Invalid years.");
    }

    if (!selectedGenres.length) {
      errorMessages.push("Please select at least one genre.");
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

  createRoom({ selectedGenres, startYear, endYear, rating }) {
    this.setState({
      creatingRoom: true
    });

    const data = { selectedGenres, startYear, endYear, rating };

    axios
      .post(`/api/rooms/`, data)
      .then(room => {
        if (room.data.noMovies) {
          return this.showErrors([
            "Not enouth movies. Please change your details."
          ]);
        }

        const roomId = room.data.roomId;
        Router.push(`/share-room?id=${roomId}`);
      })
      .finally(() => {
        this.setState({
          creatingRoom: false
        });
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

  componentWillMount() {
    const genres = this.props.genres;
    this.setState({ genres });
  }

  static async getInitialProps() {
    const genreMovieList = await moviedb.genreMovieList();

    const genres = genreMovieList.genres.map(genre => ({
      ...genre,
      selected: false
    }));

    return { genres, namespacesRequired: ["common"] };
  }

  backbtn() {
    Router.replace(`/start`);
  }

  render() {
    return (
      <div className="root-container">
        <Topbar backbtn={this.backbtn} newRoomPage={true} />
        <Headline className="description-container">
          Create the room for you and your friends.
        </Headline>
        <PageWidth>
          <div className="mm-content-padding">
            <div className="form-title">Movie genres</div>
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

            <div className="form-title">Rating</div>
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

            <div className="form-title">From year</div>
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
              <span className="two-to">to</span>
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
                Next
              </button>
            </div>
          </div>

          {this.state.creatingRoom && (
            <div className="creating-room"> Creating room </div>
          )}
        </PageWidth>
        <style jsx>
          {`
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
              background: #ffe37c;
              border-color: #ffc800;
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

            .creating-room {
              position: fixed;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              background: #ffc818d4;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              z-index: 2;
            }
          `}
        </style>
      </div>
    );
  }
}

export default CreateRoom;
