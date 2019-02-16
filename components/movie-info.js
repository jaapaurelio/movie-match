import PageWidth from "./page-width";
import MovieHead from "./movie-head";

export default ({ movie }) => {
  const crew =
    movie &&
    movie.credits &&
    movie.credits.crew &&
    movie.credits.crew.slice(0, 4);

  return (
    <section>
      <div className="main-info-bg">
        <MovieHead movie={movie} />
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
          h3 {
            padding-top: 20px;
            padding-bottom: 4px;
            font-weight: bold;
            font-size: 14px;
          }

          .main-info-bg {
            background: #f9dc7f;
          }

          .movie-description {
            padding-bottom: 20px;
            font-size: 12px;
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
