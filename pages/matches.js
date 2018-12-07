import Topbar from "../components/topbar";
import axios from "axios";

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: []
    };
  }

  async componentDidMount() {
    const moviesR = await axios.get(`/api/groups/${this.props.roomId}`);
    let { movies, group } = moviesR.data;

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
        <Topbar
          activetab="matches"
          roomId={this.props.roomId}
          title="Matches"
          matched={this.state.matches.length}
        />
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
