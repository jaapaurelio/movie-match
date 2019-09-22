import PageWidth from './page-width'
import MovieHead from './movie-head'
import { withNamespaces } from '../i18n'

export default withNamespaces('common')(
    ({ movie, showAddMoreBtn, onClickAddMore, t }) => {
        const crew =
            movie &&
            movie.credits &&
            movie.credits.crew &&
            movie.credits.crew.slice(0, 4)

        return (
            <section>
                <div className="main-info-bg">
                    <MovieHead movie={movie} />
                </div>
                <div className="movie-description-bg">
                    <PageWidth>
                        <div className="mm-content-padding movie-description">
                            <div className="add-more">
                                {t('do-you-like')} <b>{movie.title}</b>?
                                <br />
                                {showAddMoreBtn && (
                                    <button
                                        onClick={onClickAddMore}
                                        className="mm-btn add-more-btn"
                                    >
                                        {t('add-similar-movies-to-group')}
                                    </button>
                                )}
                                {!showAddMoreBtn && (
                                    <div className="add-more-btn">
                                        {t('movies-like')} <b>{movie.title}</b>{' '}
                                        {t('will-be-shown')}
                                    </div>
                                )}
                            </div>
                            <h3 className="title title-overview">
                                {t('overview')}
                            </h3>
                            {movie.overview}

                            {crew && (
                                <div>
                                    <h3 className="title">{t('crew')}</h3>
                                    <div className="crew-container">
                                        {crew.map(c => {
                                            return (
                                                <div
                                                    key={c.credit_id}
                                                    className="crew-info"
                                                >
                                                    <div className="crew-name">
                                                        {c.name}
                                                    </div>
                                                    {c.job}
                                                </div>
                                            )
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
        )
    }
)
