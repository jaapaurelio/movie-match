import Topbar from "../components/topbar";
const MovieDb = require("moviedb-promise");
const moviedb = new MovieDb("284941729ae99106f71e56126227659b");
import Dropdown from "react-dropdown";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);

    const years = [];
    for (let i = 1990; i < 2020; i++) {
      years.push(i);
    }

    this.state = {
      genres: [],
      years,
      defaultStartYear: years[0],
      defaultEndYear: years[years.length - 1]
    };
  }

  async componentDidMount() {
    const genres = await moviedb.genreMovieList();
    console.log(genres);
  }
  render() {
    return (
      <div>
        <Topbar title="Create Room" />

        <div className="description">
          Create a room and share with friends to find the perfect movie match.
        </div>

        <form>
          From:
          <select defaultValue={this.state.defaultStartYear}>
            {this.state.years.map((year, i) => {
              return (
                <option key={i} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <div>
            to:
            <select defaultValue={this.state.defaultEndYear}>
              {this.state.years.map((year, i) => {
                return (
                  <option key={i} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div>Genders</div>
        </form>
        <style jsx>
          {`
            .description {
              padding: 12px;
              text-align: center;
            }
          `}
        </style>
      </div>
    );
  }
}

export default CreateRoom;
