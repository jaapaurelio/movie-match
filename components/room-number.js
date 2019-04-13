export default ({ roomId }) => (
  <section className="container">
    <div className="room-number-desc">Room</div>
    <div className="room-number">{roomId}</div>
    <style jsx>
      {`
        .room-number-desc {
          text-align: center;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .room-number {
          text-align: center;
          font-size: 40px;
          color: #333;
          line-height: 1;
          font-weight: bold;
          margin-bottom: 20px;
        }
      `}
    </style>
  </section>
);
