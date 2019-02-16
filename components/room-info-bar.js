import PageWidth from "./page-width";

export default ({ room, users }) => {
  return (
    <div className="room-info">
      <PageWidth className="mm-content-padding">
        <div className="eli">
          <i className="fas fa-user room-info-icon" />
          <span className="room-info-text">{users.length}</span>
          <i className="fas fa-info-circle room-info-icon" />
          {room.info.startYear}-{room.info.endYear}&nbsp;
          {room.info.genres.map(g => g.name + ", ")}
        </div>
      </PageWidth>
      <style jsx>
        {`
          .room-info {
            background: #fff;
            color: #333;
            font-size: 12px;
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eaeaea;
          }

          .eli {
            white-space: nowrap;
            overflow: hidden;
          }

          .room-info-icon {
            margin-right: 4px;
          }

          .room-info-text {
            margin-right: 10px;
          }
        `}
      </style>
    </div>
  );
};
