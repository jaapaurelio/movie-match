export default ({ movie }) => {
  const getRuntime = min => {
    if (!min) {
      return "";
    }
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h + "h" + m + "m";
  };

  const crew =
    movie &&
    movie.credits &&
    movie.credits.crew &&
    movie.credits.crew.slice(0, 4);

  return (
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
            "https://image.tmdb.org/t/p/w116_and_h174_bestv2/" +
            movie.poster_path
          }
        />
        <div className="info-row">
          <span className="movie-title">{movie.title}</span>
          &nbsp;
          <span className="movie-year">
            ({movie.release_date.split("-")[0]})
          </span>
          <div>
            <span className="gender">{movie.genres_name.join(", ")}</span>
          </div>
          <span className="time"> {getRuntime(movie.runtime)} &nbsp;</span>
          {movie.adult && <span className="more-18">+18</span>}
        </div>
      </div>
      <div className="content-padding movie-description">
        <h3>Overview</h3>
        {movie.overview}

        {crew && (
          <div>
            <h3>Crew</h3>
            <div className="crew-container">
              {crew.map(c => {
                return (
                  <div className="crew-info">
                    <div className="crew-name">{c.name}</div>
                    {c.job}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>
        {`
          .content-padding {
            padding: 0px 20px;
          }

          h3 {
            padding-top: 20px;
            padding-bottom: 4px;
            font-weight: bold;
            font-size: 14px;
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
            padding-bottom: 20px;
            font-size: 12px;
            background: #143846;
            color: #fff;
            line-height: 1.5;
          }

          .crew-container {
            display: flex;
            flex-wrap: wrap;
          }

          .crew-info {
            flex-basis: 50%;
            margin-bottom: 20px;
          }
          .crew-name {
            font-weight: bold;
          }
        `}
      </style>
    </section>
  );
};
