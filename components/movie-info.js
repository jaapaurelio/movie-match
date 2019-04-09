import PageWidth from "./page-width";
import MovieHead from "./movie-head";

export default ({ movie, showAddMoreBtn, onClickAddMore }) => {
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
            <div className="add-more">
              Do you like <b>{movie.title}</b>?
              <br />
              Add similar movies to the room.
              <br />
              {showAddMoreBtn && (
                <button
                  onClick={onClickAddMore}
                  className="mm-btn add-more-btn"
                >
                  Add movies
                </button>
              )}
              {!showAddMoreBtn && (
                <div className="add-more-btn">
                  Movies like <b>{movie.title}</b> will be shown in the room.
                </div>
              )}
            </div>
            <h3 className="title title-overview">Overview</h3>
            {movie.overview}

            {crew && (
              <div>
                <h3 className="title">Crew</h3>
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
          b {
            font-weight: bold;
          }

          .add-more {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            padding: 0 20px;
            line-height: 1.5;
          }

          .add-more-btn {
            padding: 4px;
            width: auto;
            margin-top: 4px;
          }

          .title {
            padding-top: 20px;
            padding-bottom: 4px;
            font-weight: bold;
            font-size: 14px;
          }

          .main-info-bg {
            background: #ffdb6e;
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
