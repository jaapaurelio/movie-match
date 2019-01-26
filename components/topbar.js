import PageWidth from "./page-width";
import Link from "next/link";

export default ({
  newRoomPage = "",
  roomPage = "",
  matchesPage = "",
  roomId
}) => (
  <nav>
    <PageWidth>
      <div className="container">
        <Link href={`/start`}>
          <img className="logo" src="/static/Icon.png" />
        </Link>

        {!roomId && (
          <Link href={`/start`}>
            <div className="page-title">Movie Match</div>
          </Link>
        )}
        <div className="space-between" />
        <div className="top-icons-container">
          <Link href={`/start`}>
            <div className="sublink">
              <div
                className={
                  `sublink-btn ` + (newRoomPage && "sublink-btn-active")
                }
              >
                New Room
              </div>
            </div>
          </Link>
          {roomId && (
            <Link href={`/room?id=${roomId}`}>
              <div className="sublink">
                <div
                  className={
                    `sublink-btn ` + (roomPage && "sublink-btn-active")
                  }
                >
                  Room <span className="room-id-top">{roomId}</span>
                </div>
              </div>
            </Link>
          )}
          {roomId && (
            <Link href={`/matches?id=${roomId}`}>
              <div className="sublink">
                <div
                  className={
                    `sublink-btn ` + (matchesPage && "sublink-btn-active")
                  }
                >
                  Matches
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </PageWidth>

    <style jsx>
      {`
        nav {
          background: #333;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .logo {
          width: 20px;
          margin-right: 10px;
          cursor: pointer;
        }

        .space-between {
          flex-grow: 1;
        }

        .container {
          display: flex;
          height: 45px;
          padding: 0px 20px;
          align-items: center;
          color: #ffffff;
          position: relative;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          box-sizing: border-box;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 12px;
          text-transform: uppercase;
          cursor: pointer;
        }

        .top-icons-container {
          display: flex;
          height: 100%;
          align-items: center;
        }

        .top-icon {
          margin-left: 10px;
          padding: 10px;
        }

        .active-tab {
          border-bottom: 2px solid;
        }

        .matched {
          color: #ccffbc;
        }

        .sublink {
          font-size: 10px;
          margin-left: 10px;
          color: #fff;
          display: flex;
          height: 100%;
          align-items: center;
          cursor: pointer;
        }

        .sublink-btn {
          border-bottom: 1px solid #fff;
          padding: 2px;
        }

        .sublink-btn-active {
          color: #ffc818;
          border-color: #ffc818;
        }

        .room-id-top {
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      `}
    </style>
  </nav>
);
