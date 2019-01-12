import Topbar from "../components/topbar";
import Headline from "../components/headline";
import Link from "next/link";
import PageWidth from "../components/page-width";

class ShareRoom extends React.Component {
  constructor(args) {
    super(args);
    this.share = this.share.bind(this);

    this.state = {
      showShareButton: false
    };
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
    if (navigator.share) {
      this.setState({ showShareButton: true });
    }
  }

  render() {
    return (
      <div>
        <Topbar activetab="room" title="Movie Match" />
        <Headline>
          Room created. Invite your friends then join the room.
        </Headline>
        <PageWidth>
          <div className="title">Room number: {this.props.roomId}</div>
          {this.state.showShareButton && (
            <div className="options-container">
              <div className="join-title">
                Share the room number or link with friends
              </div>

              <button onClick={this.share} className="start-btn">
                Share link
              </button>
            </div>
          )}
          {!this.state.showShareButton && (
            <div className="join-title">
              Share the room number with friends and then join the room
            </div>
          )}
          <div className="options-container">
            {this.state.showShareButton && (
              <div className="join-title">and then join the room</div>
            )}
            <input
              className="room-input"
              type="text"
              maxLength="4"
              readOnly
              value={this.props.roomId}
            />
            <div>
              <Link href={`/room/?id=${this.props.roomId}`}>
                <a className="start-btn join-btn">Join Room</a>
              </Link>
            </div>
            <div className="info">People in the room: 0</div>
          </div>
        </PageWidth>
        <style jsx>{`
          .title {
            text-align: center;
            margin: 20px 0;
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
            text-align: center;
            line-height: 1;
          }

          .info {
            font-size: 12px;
            text-align: center;
            margin-top: 10px;
          }
        `}</style>
      </div>
    );
  }

  static getInitialProps({ query }) {
    return { roomId: query.id };
  }
}

export default ShareRoom;
