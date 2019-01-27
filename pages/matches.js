import axios from "axios";
import PageWidth from "../components/page-width";
import Topbar from "../components/topbar";
import Router from "next/router";

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: []
    };
    this.backbtn = this.backbtn.bind(this);
  }

  async componentDidMount() {
    const moviesR = await axios.get(`/api/room/${this.props.roomId}`);
    let { room } = moviesR.data;
    let movies = room.movies;

    const matches = movies.filter(movie => movie.matched);

    this.setState({ matches });
  }

  static getInitialProps({ query }) {
    return { roomId: query.id, namespacesRequired: ["common"] };
  }

  backbtn() {
    Router.replace(`/room?id=${this.props.roomId}`);
  }

  render() {
    return (
      <div>
        <Topbar
          backbtn={this.backbtn}
          matchesPage={true}
          activetab="room"
          roomId={this.props.roomId}
        />

        <PageWidth>
          <div className="container">
            <h1 className="title">Matches</h1>
            {this.state.matches.map(movie => (
              <div className="movie-container" key={movie.id}>
                {movie.title}
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
