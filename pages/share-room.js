import Topbar from "../components/topbar";
import Headline from "../components/headline";
import Link from "next/link";
import PageWidth from "../components/page-width";
import Footer from "../components/footer";
import converter from "number-to-words";

class ShareRoom extends React.Component {
  constructor(args) {
    super(args);
    this.share = this.share.bind(this);

    this.state = {
      showShareButton: false
    };
  }

  numberOfPeople(number) {
    const nString = converter.toWords(number);

    if (number == 0) {
      return <span>Room is empty</span>;
    } else if (number == 1) {
      return (
        <span>
          There is <strong>one</strong> person in the room
        </span>
      );
    } else {
      return (
        <span>
          There is <strong>{nString}</strong> people in the room
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
    if (navigator.share) {
      this.setState({ showShareButton: true });
    }
  }

  render() {
    return (
      <div>
        <Topbar activetab="room" title="Movie Match" />
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
            <div className="info">{this.numberOfPeople(3)}</div>
          </div>
          <Footer />
        </PageWidth>
        <style jsx>{`
          .sss {
            font-weight: bold;
          }
          .title {
            text-align: center;
            margin: 20px 0 10px;
            font-family: "Oswald", sans-serif;
            font-size: 14px;
          }

          .room-number {
            text-align: center;
            font-size: 40px;
            font-family: "Oswald", sans-serif;
            color: #0b6561;
            line-height: 1;
            margin-bottom: 10px;
          }

          .share-btn {
            width: auto;
            padding: 6px 15px;
            border: 0;
            border-bottom: 1px solid #0b6561;
            background: transparent;
            border-radius: 0;
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
    return { roomId: query.id };
  }
}

export default ShareRoom;
