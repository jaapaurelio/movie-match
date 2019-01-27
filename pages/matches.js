import axios from "axios";
import PageWidth from "../components/page-width";
import Topbar from "../components/topbar";
import Router from "next/router";
import Headline from "../components/headline";
import MovieHead from "../components/movie-head";

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      loading: true,
      showMore: false
    };
    this.backbtn = this.backbtn.bind(this);
    this.toggleShowMore = this.toggleShowMore.bind(this);
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

  toggleShowMore() {
    this.setState({
      showMore: !this.state.showMore
    });
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

        <div className="container">
          <Headline>
            We found the perfect match for you. <br />
            Have a nice movie!
          </Headline>
          {this.state.matches.length && (
            <div>
              <PageWidth>
                <h1 className="title">Matches</h1>
              </PageWidth>

              <PageWidth>
                <div className="movie-container perfect-match">
                  <MovieHead movie={this.state.matches[0]} />
                </div>

                <div className="show-more-container">
                  <button onClick={this.toggleShowMore} className="mm-btn">
                    Show more matches
                  </button>
                </div>
                {this.state.showMore && (
                  <div className="other-options">
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
                  </div>
                )}
              </PageWidth>
              <PageWidth>
                {!this.state.matches.length && (
                  <div className="mm-big-message">
                    No matches yet. Keep trying.
                  </div>
                )}
              </PageWidth>
            </div>
          )}
        </div>

        <style jsx>{`
          .movie-container {
          }

          .title {
            font-size: 16px;
            padding: 20px;
          }

          .movie-info {
            padding-left: 20px;
          }

          .movie-title {
            font-weight: bold;
          }

          .show-more-container {
            text-align: center;
          }

          .other-options {
            background: #efefef;
            border-radius: 4px;
            margin-top: 20px;
            padding: 20px;
          }
        `}</style>
      </div>
    );
  }
}

export default Matches;
