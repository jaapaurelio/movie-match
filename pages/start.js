import Topbar from "../components/topbar";
import Link from "next/link";
import Router from "next/router";
import PageWidth from "../components/page-width";
import Headline from "../components/headline";
import Footer from "../components/footer";
import { withNamespaces } from "../i18n";

class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: undefined
    };

    this.onChangeId = this.onChangeId.bind(this);
    this.join = this.join.bind(this);

    this.steps = [
      this.props.t("headline1"),
      this.props.t("headline2"),
      this.props.t("headline3")
    ];
  }

  onChangeId(event) {
    console.log(event.target.value);

    this.setState({ roomId: event.target.value });
  }

  join() {
    if (this.state.roomId) {
      Router.push(`/room?id=${this.state.roomId}`);
    }
  }

  render() {
    return (
      <div>
        <Topbar newRoomPage={true} activetab="room" />
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
                <a className="mm-btn">Create a Room</a>
              </Link>
            </div>

            <div className="info">Friends will join you later</div>
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

  static async getInitialProps() {
    return {
      namespacesRequired: ["common"]
    };
  }
}

export default withNamespaces("common")(Start);
