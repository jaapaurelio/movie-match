import Topbar from "../components/topbar";
import TopbarButton from "../components/topbar-button";
import Link from "next/link";
import axios from "axios";

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: []
    };
  }

  async componentDidMount() {
    const moviesR = await axios.get(`/api/room/${this.props.roomId}/x`);
    let { group } = moviesR.data;
    let movies = group.movies;

    const matches = Object.keys(group.likes).reduce((acc, movieId) => {
      if (group.likes[movieId] === group.numberOfUser) {
        acc.push(movies[movieId]);
      }

      return acc;
    }, []);

    this.setState({ matches });
  }

  static getInitialProps({ query }) {
    return { roomId: query.id };
  }

  render() {
    return (
      <div>
        <Topbar activetab="room" title="Matches">
          <TopbarButton>
            <Link href={`/start`}>
              <div className={`top-icon`}>
                <i className="fas fa-home" />
              </div>
            </Link>
          </TopbarButton>
          <TopbarButton>
            <Link href={`/room?id=${this.props.roomId}`}>
              <div className={`top-icon`}>
                <i className="fas fa-clone" />
              </div>
            </Link>
          </TopbarButton>
          <TopbarButton>
            <Link href={`/matches?id=${this.props.roomId}`}>
              <div
                className={`top-icon active-tab ${
                  this.state.matches.length ? "matched" : ""
                }`}
              >
                <i className="fas fa-heart" />
              </div>
            </Link>
          </TopbarButton>
        </Topbar>

        <div className="container">
          {this.state.matches.map(movie => (
            <div key={movie.id}>
              <div className="movie-title">{movie.title}</div>
            </div>
          ))}
          {!this.state.matches.length && (
            <div className="mm-big-message">No matches yet. Keep trying.</div>
          )}
        </div>
        <style jsx>{`
          .container {
            padding: 12px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

export default Matches;
