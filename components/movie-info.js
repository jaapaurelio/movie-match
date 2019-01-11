import PageWidth from "../components/page-width";

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
      {/*<div className="movie-backdrop">
        <img
          src={
            "https://image.tmdb.org/t/p/w700_and_h392_bestv2" +
            movie.backdrop_path
          }
        />
        </div>*/}
      <div className="main-info-bg">
        <PageWidth>
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
              <div className="small-info">
                <i className="far fa-star info-icon score-icon" />
                <span className="score">{movie.vote_average}</span>
                <span className="score-small">/10</span>
                <i className="far info-icon fa-clock" />
                <span className="time">
                  {" "}
                  {getRuntime(movie.runtime)} &nbsp;
                </span>
                {movie.adult && <span className="more-18">+18</span>}
              </div>
            </div>
          </div>
        </PageWidth>
      </div>
      <div className="movie-description-bg">
        <PageWidth>
          <div className="mm-content-padding movie-description">
            <h3>Overview</h3>
            {movie.overview}

            {crew && (
              <div>
                <h3>Crew</h3>
                <div className="crew-container">
                  {crew.map(c => {
                    return (
                      <div key={c.credit_id} className="crew-info">
                        <div className="crew-name">{c.name}</div>
                        {c.job}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </PageWidth>
      </div>

      <style jsx>
        {`
          .small-info {
            display: flex;
            align-items: baseline;
          }

          .info-icon {
            font-size: 11px;
            align-self: center;
            margin-right: 4px;
          }

          .score-icon {
            color: #e0ce34;
          }

          .score-small {
            color: #8e8e8e;
            font-size: 12px;
            margin-right: 8px;
          }

          h3 {
            padding-top: 20px;
            padding-bottom: 4px;
            font-weight: bold;
            font-size: 14px;
          }

          .movie-backdrop {
            text-align: center;
            max-height: 130px;
            overflow: hidden;
          }

          .movie-backdrop img {
            max-width: 100%;
          }

          .movie-poster {
            width: 100px;
            margin-left: 10px;
          }

          .main-info-bg {
            background: #1f1f1f;
          }

          .main-info {
            padding: 10px 0;
            position: relative;
            color: #fff;
            display: flex;
            justify-content: start;
            align-items: center;
          }

          .info-row {
            margin-bottom: 6px;
            padding: 0 10px;
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

          .movie-description-bg {
            background: #143846;
          }

          .movie-description {
            padding-bottom: 20px;
            font-size: 12px;

            color: #fff;
            line-height: 1.5;
            min-height: 240px;
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
