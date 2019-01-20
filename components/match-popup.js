export default ({ show, onClickMatches, onClickKeepPlaying }) => (
  <div className={`popup-container ${show ? "show" : ""}`}>
    <div className="popup-content">
      <h1>It's a match!</h1>
      <div className="desc">You can watch it now</div>
      <div className="btn-container">
        <div onClick={onClickMatches} className="match-btn">
          Check matches
        </div>
        <div onClick={onClickKeepPlaying} className="match-btn">
          Keep playing
        </div>
      </div>
    </div>

    <style jsx>
      {`
        .popup-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          background: #393939fa;
          transition: opacity 0.2s linear;
          visibility: hidden;
          opacity: 0;
        }

        .popup-container.show {
          visibility: visible;
          opacity: 1;
        }

        .popup-content {
          padding: 40px;
          color: #fff;
          text-align: center;
        }

        h1 {
          font-size: 30px;
        }

        .desc {
          margin-bottom: 50px;
          font-size: 14px;
        }

        .btn-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .match-btn {
          border: 1px solid #fff;
          padding: 4px;
          cursor: pointer;
          margin-bottom: 20px;
          width: 200px;
          text-align: center;
        }
      `}
    </style>
  </div>
);
