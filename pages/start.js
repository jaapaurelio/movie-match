import Topbar from "../components/topbar";
import Link from "next/link";
import Router from "next/router";

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
          {steps.map((step, i) => {
            return <div className="step-details">{step}</div>;
          })}
        </div>
        <div className="options-container">
          <div className="create-room-btn-container">
            <Link href={`/create-room`}>
              <a className="start-btn">Create a Room</a>
            </Link>
          </div>

          <div className="info">Friends will join you later.</div>
        </div>
        <div className="options-container">
          <div className="join-title">Join a room</div>
          <div>
            <input
              className="room-input"
              type="text"
              placeholder="xxxx"
              maxlength="4"
              onChange={this.onChangeId}
            />
            <button className="start-btn" onClick={this.join}>
              Join
            </button>
          </div>

          <div className="info">
            Ask your friend for the room number and join him/her.
          </div>
        </div>
        <style jsx>{`
          .info {
            font-size: 12px;
            text-align: center;
            margin-top: 10px;
          }

          .start-here {
            font-size: 16px;
            font-weight: bold;
            margin: 12px 0;
            padding: 0 20px;
          }

          .headline {
            padding: 0 20px;
            font-size: 14px;
            margin-bottom: 10px;
            text-align: center;
          }

          .steps-area {
            padding: 20px;
            font-family: "Thasadith", sans-serif;
            background: aquamarine;
            margin-bottom: 20px;
          }

          .steps-area h1 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .step-details {
            font-size: 16px;
          }

          .options-container {
            padding: 20px;
            text-align: center;
          }

          .create-room-btn-container {
            padding: 0 10px;
            text-align: center;
          }

          .start-btn {
            display: inline-block;
            padding: 10px;
            border: 1px solid green;
            border-radius: 4px;
            text-decoration: none;
            color: green;
            font-size: 16px;
            cursor: pointer;
            background: transparent;
          }

          .join-title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
          }

          .room-input {
            padding: 10px;
            font-size: 16px;
            width: 80px;
            text-align: center;
            margin-right: 10px;
            border: 1px solid #eee;
          }
        `}</style>
      </div>
    );
  }
}

export default Start;
