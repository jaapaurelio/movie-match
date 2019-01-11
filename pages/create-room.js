import Topbar from "../components/topbar";
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");
import axios from "axios";
import Router from "next/router";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);

    const years = [];
    for (let i = 1900; i <= 2019; i++) {
      years.push(i);
    }

    const ratings = [];
    for (let i = 1; i <= 10; i++) {
      ratings.push(i + ".0");
    }

    this.state = {
      genres: [],
      allSelected: false,
      errorMessages: [],
      startYear: 1990,
      endYear: 2019,
      ratingGte: "7.0",
      ratingLte: "10.0",
      creatingRoom: false
    };

    this.CONST = {
      years,
      ratings
    };

    this.unselectAllGenres = this.unselectAllGenres.bind(this);
    this.toggleGenre = this.toggleGenre.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.showErrors = this.showErrors.bind(this);
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
      ratingGte: Number(this.state.ratingGte),
      ratingLte: Number(this.state.ratingLte)
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

  createRoom(movieData) {
    this.setState({
      creatingRoom: true
    });

    axios
      .post(`/api/rooms/`, movieData)
      .then(room => {
        console.log(room.data);
        if (room.data.noMovies) {
          return this.showErrors([
            "Not enouth movies. Please change your details."
          ]);
        }

        const roomId = room.data.roomId;
        Router.push(`/room?id=${roomId}`);
      })
      .finally(() => {
        this.setState({
          creatingRoom: false
        });
      });
  }

  unselectAllGenres() {
    const allSelected = !this.state.allSelected;

    const genres = this.state.genres.map(genre => ({
      ...genre,
      selected: false
    }));

    this.setState({ genres, allSelected });
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
    const genreMovieList = await moviedb.genreMovieList();

    const genres = genreMovieList.genres.map(genre => ({
      ...genre,
      selected: false
    }));

    this.setState({ genres });
  }

  render() {
    return (
      <div className="root-container">
        <Topbar title="Create Room" />

        <div className="content-padding description">
          Create the room for you and your friends. They'll join later.
        </div>

        <div className="content-padding">
          <div className="form-title">Movies from year</div>
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

          <div className="form-title">Ratings from</div>
          <div className="two-selects-row">
            <select
              className="select-m"
              defaultValue={this.state.ratingGte}
              onChange={event => {
                this.setState({ ratingGte: event.target.value });
              }}
            >
              {this.CONST.ratings.map((rating, i) => {
                return (
                  <option key={i} value={rating}>
                    {rating}
                  </option>
                );
              })}
            </select>
            <span className="two-to">to</span>
            <select
              className="select-m"
              defaultValue={this.state.ratingLte}
              onChange={event => {
                this.setState({ ratingLte: event.target.value });
              }}
            >
              {this.CONST.ratings.map((rating, i) => {
                return (
                  <option key={i} value={rating}>
                    {rating}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-title">Genders</div>
          <div className="checkbox-m select-all">
            <label htmlFor="ALL" onClick={this.unselectAllGenres}>
              Clear all
            </label>
          </div>
          <div className="genders-container">
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
            <button onClick={this.submitForm} className="create-room-btn">
              Next
            </button>
          </div>
        </div>

        {this.state.creatingRoom && (
          <div className="creating-room"> Creating room </div>
        )}
        <style jsx>
          {`
            .container {
              padding: 0 10px;
            }

            .description {
              padding: 20px;
              font-size: 16px;
              text-align: left;
              background: #840c49;
              color: #fff;
              font-family: "Thasadith", sans-serif;
              margin-bottom: 20px;
            }

            .form-title {
              font-size: 16px;
              font-weight: bold;
              margin: 12px 0;
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

            .genders-container {
              display: flex;
              flex-wrap: wrap;
            }

            .checkbox-m {
              display: inline-block;
              user-select: none;
              width: 50%;
              box-sizing: content-box;
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
            }

            .checkbox-m label.selected {
              background: #d6fde4;
              border-color: #90e0a9f7;
              color: #31503b;
            }

            .create-room-btn-container {
              text-align: right;
            }

            .create-room-btn {
              display: inline-block;
              padding: 10px;
              border: 1px solid #840c49;
              border-radius: 4px;
              text-decoration: none;
              color: #840c49;
              font-size: 16px;
              cursor: pointer;
              background: transparent;

              margin: 20px 0;
              width: 75%;
            }

            .toast-error-container {
              position: fixed;
              z-index: 2;
              bottom: 100px;
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
              background: #365c69cc;
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
