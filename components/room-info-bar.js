import PageWidth from "./page-width";

export default ({ room, users }) => {
  return (
    <PageWidth className="mm-content-padding">
      <div className="room-info">
        <div className="eli">
          <i className="fas fa-user room-info-icon" />
          <span className="room-info-text">{users.length}</span>
          <i className="fas fa-info-circle room-info-icon" />
          {users.map(u => u.name).join(", ")}
        </div>
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
        `}
      </style>
    </PageWidth>
  );
};
