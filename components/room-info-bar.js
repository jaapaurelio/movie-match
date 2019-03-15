import PageWidth from "./page-width";

export default ({ showShare, shareBtn, room, users }) => {
  return (
    <PageWidth className="mm-content-padding">
      <div className="room-info">
        <div className="eli">
          <i className="fas fa-user room-info-icon" />
          <span className="room-info-text">{users.length}</span>
          <i className="fas fa-info-circle room-info-icon" />
          {room.info.startYear}-{room.info.endYear}&nbsp;
          {room.info.genres.map(g => g.name + ", ")}
        </div>
        {showShare && (
          <button onClick={shareBtn} className="mm-btn share-btn">
            Share
          </button>
        )}
      </div>
      <style jsx>
        {`
          .room-info {
            background: #fff;
            color: #333;
            font-size: 12px;
            padding: 10px 0;
            display: flex;
          }

          .eli {
            white-space: nowrap;
            overflow: hidden;
            flex-grow: 1;
            margin-right: 10px;
            text-overflow: ellipsis;
          }

          .room-info-icon {
            margin-right: 4px;
          }

          .room-info-text {
            margin-right: 10px;
          }

          .share-btn {
            width: auto;
            padding: 2px 4px;
            border: 0;
            border: 1px solid #fedc6e;
            background: transparent;
            color: #333;
            border-radius: 4px;
            font-size: 12px;
            flex-shrink: 0;
          }
        `}
      </style>
    </PageWidth>
  );
};
