import Topbar from "../components/topbar";
import Headline from "../components/headline";
import Link from "next/link";
import PageWidth from "../components/page-width";
import converter from "number-to-words";
import Pusher from "pusher-js";
import axios from "axios";
import Router from "next/router";

class ShareRoom extends React.Component {
  constructor(args) {
    super(args);
    this.share = this.share.bind(this);

    this.state = {
      showShareButton: false,
      users: []
    };
  }

  numberOfPeople(number) {
    if (number == 0) {
      return "";
    } else if (number == 1) {
      return <span>You are alone in the room.</span>;
    } else if (number == 2) {
      return (
        <span>
          You have <strong>one</strong> friend in the room.
        </span>
      );
    } else {
      const nString = converter.toWords(number - 1);

      return (
        <span>
          You have <strong>{nString}</strong> friends in the room.
        </span>
      );
    }

    return <div>{s}</div>;
  }

  share() {
    if (navigator.share) {
      const url = `${location.origin}/room?id=${this.props.roomId}`;
      navigator.share({
        title: "Movie Match",
        text: "Movie match room",
        url
      });
    }
  }

  componentDidMount() {
    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true
    });

    this.channel = this.pusher.subscribe(`room-${this.props.roomId}`);

    this.channel.bind("users", users => {
      this.setState({
        users
      });
    });

    this.pusher.connection.bind("connected", async () => {
      const moviesR = await axios.get(`/api/room/${this.props.roomId}`);
      let { room } = moviesR.data;

      if (!room) {
        return Router.push(`/start`);
      }

      this.setState({ users: room.users });
    });

    if (navigator.share) {
      this.setState({ showShareButton: true });
    }
  }

  componentWillUnmount() {
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }

  render() {
    return (
      <div>
        <Topbar newRoomPage={true} activetab="room" />
        <Headline>
          Share the room with friends. They can join any time.
        </Headline>
        <PageWidth>
          <div className="title">room</div>
          <div className="room-number">{this.props.roomId}</div>
          {this.state.showShareButton && (
            <div className="options-container">
              <button onClick={this.share} className="mm-btn share-btn">
                Share
              </button>
            </div>
          )}
          <div className="options-container">
            <div className="join-title">Share and join the room</div>
            <input
              className="room-input"
              type="text"
              maxLength="4"
              readOnly
              value={this.props.roomId}
            />
            <div>
              <Link prefetch href={`/room?id=${this.props.roomId}`}>
                <a className="mm-btn join-btn">Join Room</a>
              </Link>
            </div>
            <div className="info">
              {this.numberOfPeople(this.state.users.length)}
            </div>
          </div>
        </PageWidth>
        <style jsx>{`
          .title {
            text-align: center;
            margin: 20px 0 10px;
            font-size: 14px;
          }

          .room-number {
            text-align: center;
            font-size: 40px;
            color: #333;
            line-height: 1;
            margin-bottom: 10px;
            font-weight: bold;
          }

          .share-btn {
            width: auto;
            padding: 6px 15px;
            border: 0;
            border-bottom: 1px solid #00b9a7;
            background: transparent;
            border-radius: 0;
            color: #00b9a7;
          }

          .info {
            font-size: 12px;
            text-align: center;
            margin-top: 10px;
          }

          .note {
            margin-top: 40px;
            font-size: 12px;
          }
        `}</style>
      </div>
    );
  }

  static getInitialProps({ query }) {
    const roomId = query.id && query.id.toUpperCase();
    return { roomId, namespacesRequired: ["common"] };
  }
}

export default ShareRoom;
