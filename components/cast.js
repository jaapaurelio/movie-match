export default ({ children }) => (
  <div className="content-padding actors-container">
    <h3>Cast</h3>

    <div className="actors">
      <div className="actor-container">
        <img
          className="actor-image"
          src="https://image.tmdb.org/t/p/w240_and_h266_face/gXKyT1YU5RWWPaE1je3ht58eUZr.jpg"
        />
        <div className="actor-name">Chris Pratt</div>
        <div className="actor-persona">Peter Quill / Star-Lord</div>
      </div>
      <div className="actor-container">
        <img
          className="actor-image"
          src="https://image.tmdb.org/t/p/w240_and_h266_face/ofNrWiA2KDdqiNxFTLp51HcXUlp.jpg"
        />
        <div className="actor-name">Zoe Saldana</div>
        <div className="actor-persona">Gamora</div>
      </div>
    </div>
    <style jsx>
      {`
        h3 {
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        strong {
          font-weight: bold;
        }

        .actors-container {
          margin: 20px 0;
        }

        .actors {
          display: flex;
        }

        .actor-container {
          margin-top: 10px;
          width: 100px;
          margin-right: 10px;
        }

        .actor-image {
          max-width: 100%;
        }

        .actor-name {
          font-size: 12px;
          font-weight: bold;
        }

        .actor-persona {
          font-size: 12px;
        }
      `}
    </style>
  </div>
);
