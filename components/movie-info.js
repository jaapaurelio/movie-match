export default ({ movie }) => (
  <section>
    <div className="movie-backdrop">
      <img
        src={
          "https://image.tmdb.org/t/p/w700_and_h392_bestv2" +
          movie.backdrop_path
        }
      />
    </div>
    <div className="main-info">
      <img
        className="movie-poster"
        src={
          "https://image.tmdb.org/t/p/w174_and_h261_bestv2" + movie.poster_path
        }
      />
      <div className="info-row">
        <span className="movie-title">{movie.title}</span>
        &nbsp;
        <span className="movie-year">({movie.release_date.split("-")[0]})</span>
        <div>
          <span className="gender">{movie.genres.join(", ")}</span>
        </div>
        <span className="time">2h 1m &nbsp;</span>
        {movie.adult && <span className="more-18">+18</span>}
      </div>
    </div>
    <div className="content-padding movie-description">
      <h3>Overview</h3>
      {movie.overview}
      <div>
        <br />
        <strong>James Gunn</strong>
        <br />
        Director
      </div>
    </div>
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
    </div>

    <style jsx>
      {`
        .content-padding {
          padding: 0px 20px;
        }

        .movie-backdrop {
          text-align: center;
        }

        .movie-backdrop img {
          max-width: 100%;
        }

        .movie-poster {
          width: 100px;
          position: absolute;
          top: -50px;
          left: 10px;
        }

        .main-info {
          padding: 20px 0;
          position: relative;
          background: #1f1f1f;
          color: #fff;
          margin-top: -10px;
        }

        .info-row {
          margin-left: 120px;
          margin-bottom: 6px;
        }

        .big-space {
          margin-bottom: 14px;
        }

        .movie-title {
          font-weight: bold;
        }

        .gender {
          display: inline-block;
          margin-right: 4px;
          padding: 2px;
          font-size: 12px;
        }

        .time {
          font-size: 12px;
        }

        .more-18 {
          border: 1px solid red;
          font-size: 12px;
          padding: 0 2px;
          color: red;
        }

        .movie-description {
          padding-top: 20px;
          padding-bottom: 20px;
          font-size: 12px;
          background: #143846;
          color: #fff;
          line-height: 1.5;
        }
      `}
    </style>
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
  </section>
);
