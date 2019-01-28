import axios from "axios";
import PageWidth from "../components/page-width";
import Topbar from "../components/topbar";
import Router from "next/router";
import Headline from "../components/headline";
import MovieHead from "../components/movie-head";
import Loader from "../components/loader";

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      loading: true
    };
    this.backbtn = this.backbtn.bind(this);
  }

  async componentDidMount() {
    const moviesR = await axios.get(`/api/room/${this.props.roomId}`);
    let { room } = moviesR.data;

    const matches = room.matches.map(movieId => {
      return {
        ...room.movies.find(m => movieId === m.id),
        release_date: "2131-12-23"
      };
    });

    this.setState({ matches, loading: false });
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
        {this.state.loading && <Loader />}
        {!!this.state.matches.length && (
          <div className="container">
            <Headline>
              We found the perfect match for you. <br />
              Have a nice movie!
            </Headline>

            <div>
              <PageWidth>
                <h1 className="title">Perfect match</h1>
              </PageWidth>

              <PageWidth>
                <div className="movie-container perfect-match">
                  <MovieHead movie={this.state.matches[0]} />
                </div>
              </PageWidth>

              <div className="other-options">
                <PageWidth>
                  <h1 className="title">Alternative matches</h1>
                  {this.state.matches.map((movie, i) => {
                    {
                      return (
                        i != 0 && (
                          <div className="movie-container" key={movie.id}>
                            <MovieHead movie={movie} />
                          </div>
                        )
                      );
                    }
                  })}
                </PageWidth>
              </div>
            </div>
          </div>
        )}

        <PageWidth>
          {!this.state.loading && !this.state.matches.length && (
            <div className="info-message">No matches yet. Keep trying.</div>
          )}
        </PageWidth>

        <style jsx>{`
          .title {
            font-size: 14px;
            padding: 20px 20px 10px 20px;
            text-align: center;
            font-weight: bold;
            text-align: right;
          }

          .movie-info {
            padding-left: 20px;
          }

          .movie-title {
            font-weight: bold;
          }

          .show-more-container {
            text-align: center;
            margin: 20px 0;
          }

          .other-options {
            background: #efefef;
            margin-top: 20px;
          }

          .info-message {
            text-align: center;
            padding-top: 20px;
          }
        `}</style>
      </div>
    );
  }
}

export default Matches;
