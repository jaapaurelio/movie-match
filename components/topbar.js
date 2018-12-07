import Link from "next/link";

export default ({ matched, activetab, roomId, title = "Movie Match" }) => (
  <nav>
    <div className="container">
      <div className="page-title">{title}</div>
      <div className="top-icons-container">
        <Link href={`/room?id=${roomId}`}>
          <div
            className={`top-icon ${activetab === "room" ? "active-tab" : ""}`}
          >
            <i className="fas fa-clone" />
          </div>
        </Link>
        <Link href={`/matches?id=${roomId}`}>
          <div
            className={`top-icon ${
              activetab === "matches" ? "active-tab" : ""
            } ${matched ? "matched" : ""}`}
          >
            <i className="fas fa-heart" />
          </div>
        </Link>
      </div>
    </div>

    <style jsx>
      {`
        .container {
          background: #123846;
          display: flex;
          justify-content: space-between;
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
          font-weight: bold;
          text-transform: uppercase;
        }

        .top-icons-container {
          display: flex;
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
      `}
    </style>
  </nav>
);
