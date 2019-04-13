import Topbar from "../components/topbar";
import Link from "next/link";
import Router from "next/router";
import PageWidth from "../components/page-width";
import Headline from "../components/headline";
import UserPop from "../components/user-popup";
import { withNamespaces } from "../i18n";
import jsCookie from "js-cookie";
import { connect } from "react-redux";
import axios from "axios";

class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: undefined,
      lastRoomId: undefined,
      username: ""
    };

    this.onChangeId = this.onChangeId.bind(this);
    this.join = this.join.bind(this);
    this.createRoom = this.createRoom.bind(this);

    this.steps = ["Create a room", "Invite friends", "Find the perfect movie"];
  }

  onChangeId(event) {
    this.setState({ roomId: event.target.value });
  }

  join() {
    if (this.state.roomId) {
      Router.push(`/waiting-room?id=${this.state.roomId}`);
    }
  }

  componentDidMount() {
    const lastRoomId = jsCookie.get("roomId");
    var username = localStorage.getItem("username");

    this.setState({ lastRoomId, username });
  }

  async createRoom() {
    if (this.state.creatingRoom) return;

    this.setState({ creatingRoom: true });
    const roomResponse = await axios.post("/api/create-room");
    this.setState({ creatingRoom: false });

    Router.push(`/waiting-room?id=${roomResponse.data.roomId}`);
  }

  render() {
    return (
      <div>
        <Topbar
          roomId={this.state.lastRoomId}
          newRoomPage={true}
          title="Movie Match"
        />
        <Headline>
          Hi{" "}
          <span onClick={this.changeName} className="username">
            {this.state.username}
          </span>
          , let's find the perfect movie.
        </Headline>
        <PageWidth>
          <div className="options-container create-room-container">
            <div className="join-title">Create a room</div>

            <div className="create-room-btn-container">
              <button onClick={this.createRoom} className="mm-btn">
                Create
              </button>
            </div>
          </div>
          <div className="options-container">
            <div className="join-title">Join a room</div>
            <div>
              <input
                className="room-input"
                type="text"
                placeholder="xxxx"
                maxLength="4"
                onChange={this.onChangeId}
              />
              <div>
                <button className="join-btn mm-btn" onClick={this.join}>
                  Join
                </button>
              </div>
            </div>
            <div className="info">Ask your friend for the room number</div>
          </div>
          <div className="how-to-link">
            <Link href="/intro">
              <a>How to use?</a>
            </Link>
          </div>
        </PageWidth>

        <footer>
          Movie details provided by{" "}
          <a href="https://www.themoviedb.org" target="_blank">
            themoviedb
          </a>
          .
        </footer>

        <UserPop />

        <style jsx>{`
          .username {
            text-decoration: underline;
          }

          .info {
            font-size: 12px;
            text-align: center;
            margin-top: 10px;
          }

          .step-details {
            font-size: 16px;
          }
          .step-details:not(:first-child) {
            margin-top: 10px;
          }

          .options-container {
            border-bottom: 1px solid whitesmoke;
          }

          .create-room-btn-container {
            padding: 0 10px;
            text-align: center;
          }

          footer {
            text-align: center;
            font-size: 12px;
            margin-top: 40px;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            padding: 5px;
          }

          footer a {
            color: #333;
          }

          .how-to-link {
            text-align: center;
            margin-top: 40px;
          }

          .how-to-link a {
            color: #333;
            font-size: 12px;
          }
        `}</style>
      </div>
    );
  }

  static getInitialProps() {
    return {
      namespacesRequired: ["common"]
    };
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { userName: user.name };
}

export default connect(
  mapStateToProps,
  null
)(withNamespaces("common")(Start));
