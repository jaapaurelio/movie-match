import Topbar from "../components/topbar";
import Link from "next/link";
import Router from "next/router";
import PageWidth from "../components/page-width";

const steps = [
  "Create or join a room.",
  "Say yes to movies you want to watch.",
  "Discover the perfect movie to watch together."
];
class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: undefined
    };

    this.onChangeId = this.onChangeId.bind(this);
    this.join = this.join.bind(this);
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
        <Topbar activetab="room" title="Movie Match" />
        <div className="steps-area">
          <PageWidth className="mm-all-padding">
            {steps.map((step, i) => {
              return (
                <div key={i} className="step-details">
                  {step}
                </div>
              );
            })}
          </PageWidth>
        </div>
        <PageWidth>
          <div className="options-container">
            <div className="join-title">One creates the room</div>

            <div className="create-room-btn-container">
              <Link href={`/create-room`}>
                <a className="start-btn">Create a Room</a>
              </Link>
            </div>

            <div className="info">Friends will join you later</div>
          </div>
          <div className="options-container">
            <div className="join-title">The others join him/her</div>
            <div>
              <input
                className="room-input"
                type="text"
                placeholder="xxxx"
                maxLength="4"
                onChange={this.onChangeId}
              />
              <div>
                <button className="join-btn start-btn" onClick={this.join}>
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

          .steps-area {
            font-family: "Thasadith", sans-serif;
            background: #840c49;
            color: #fff;
          }

          .step-details {
            font-size: 16px;
          }

          .options-container {
            padding: 0 20px;
            text-align: center;
          }

          .create-room-btn-container {
            padding: 0 10px;
            text-align: center;
          }

          .start-btn {
            display: inline-block;
            padding: 10px;
            border: 1px solid #840c49;
            border-radius: 4px;
            text-decoration: none;
            color: #840c49;
            font-size: 16px;
            cursor: pointer;
            background: transparent;
            width: 170px;
            box-sizing: border-box;
          }

          .join-title {
            text-align: center;
            font-weight: bold;
            margin: 20px 0;
            font-size: 14px;
          }

          .room-input {
            padding: 10px;
            font-size: 16px;
            text-align: center;
            border: 1px solid #b7b7b7;
            width: 170px;
            box-sizing: border-box;
          }

          .join-btn {
            margin-top: 10px;
          }

          .or {
            font-size: 16px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

export default Start;
