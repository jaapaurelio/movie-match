import Topbar from "../components/topbar";
import TopbarButton from "../components/topbar-button";
import Link from "next/link";
import axios from "axios";
import MovieInfo from "../components/movie-info";
import PageWidth from "../components/page-width";

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

        <PageWidth>
          <div className="container">
            <h1 className="title">Matches</h1>
            {this.state.matches.map(movie => (
              <div className="movie-container" key={movie.id}>
                <MovieInfo movie={movie} />
              </div>
            ))}
            {!this.state.matches.length && (
              <div className="mm-big-message">No matches yet. Keep trying.</div>
            )}
          </div>
        </PageWidth>
        <style jsx>{`
          .movie-container {
            margin: 0 20px 20px 20px;
            box-sizing: border-box;
            background: whitesmoke;
            border-radius: 4px;
          }

          .title {
            font-size: 16px;
            padding: 20px;
          }
        `}</style>
      </div>
    );
  }
}

export default Matches;
