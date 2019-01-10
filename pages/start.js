import Topbar from "../components/topbar";
import Link from "next/link";
import Router from "next/router";

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
        <br />
        <br />
        <Link href={`/create-room`}>
          <a>Create Room</a>
        </Link>
        <div className="info">
          Create a room so friends can join you to find the perfect movie to
          watch.
        </div>
        <br />
        <br />
        <div>Or join a room:</div>
        Room number: <input type="text" onChange={this.onChangeId} />{" "}
        <button onClick={this.join}>Join</button>
        <div className="info">
          Ask you friend for the room number and join him/her.
        </div>
        <style jsx>{`
          input,
          button {
            border: 1px solid black;
          }

          .info {
            font-size: 12px;
          }
        `}</style>
      </div>
    );
  }
}

export default Start;
