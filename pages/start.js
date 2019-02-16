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

    this.steps = [
      "Create or join a room.",
      "Say yes to movies you want to watch.",
      "Find the perfect movie."
    ];
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
          {this.steps.map((step, i) => {
            return (
              <div key={i} className="step-details">
                {i + 1}. {step}
              </div>
            );
          })}
        </Headline>
        <PageWidth>
          <div className="options-container">
            <div className="join-title">One creates the room</div>

            <div className="create-room-btn-container">
              <Link prefetch href={`/create-room`}>
                <a className="mm-btn">Create</a>
              </Link>
            </div>
          </div>
          <div className="options-container">
            <div className="join-title">Others join him/her</div>
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
        </PageWidth>

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

          .create-room-btn-container {
            padding: 0 10px;
            text-align: center;
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
