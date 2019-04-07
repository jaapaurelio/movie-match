import Topbar from "../components/topbar";
import Link from "next/link";
import Router from "next/router";
import PageWidth from "../components/page-width";
import Headline from "../components/headline";
import { withNamespaces } from "../i18n";
import jsCookie from "js-cookie";

class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: undefined,
      lastRoomId: undefined
    };

    this.onChangeId = this.onChangeId.bind(this);
    this.join = this.join.bind(this);

    this.steps = ["Create a room", "Invite friends", "Find the perfect movie"];
  }

  onChangeId(event) {
    this.setState({ roomId: event.target.value });
  }

  join() {
    if (this.state.roomId) {
      Router.push(`/room?id=${this.state.roomId}`);
    }
  }

  componentDidMount() {
    const lastRoomId = jsCookie.get("roomId");
    this.setState({ lastRoomId });

    const introVisited = jsCookie.get("intro-visited");

    if (!introVisited) {
      Router.push("/intro");
    }
  }

  render() {
    return (
      <div>
        <Topbar
          roomId={this.state.lastRoomId}
          newRoomPage={true}
          title="Movie Match"
        />
        <Headline>Find the perfect movie.</Headline>
        <PageWidth>
          <div className="options-container create-room-container">
            <div className="join-title">Create a room</div>

            <div className="create-room-btn-container">
              <Link prefetch href={`/create-room`}>
                <a className="mm-btn">Create</a>
              </Link>
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

        <style jsx>{`
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

          .create-room-container {
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
          }

          .how-to-link a {
            color: #333;
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

export default withNamespaces("common")(Start);
