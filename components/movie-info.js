import PageWidth from './page-width'

export default function MovieInfo({ movie, t }) {
    const crew =
        movie &&
        movie.credits &&
        movie.credits.crew &&
        movie.credits.crew.slice(0, 4)

    return (
        <section>
            <div>
                <PageWidth>
                    <div className="mm-content-padding movie-description">
                        {crew && (
                            <div>
                                <h3 className="title">{t('crew')}</h3>
                                <div className="crew-container">
                                    {crew.map((c) => {
                                        return (
                                            <div
                                                key={c.credit_id}
                                                className="crew-info"
                                            >
                                                <div className="crew-name">
                                                    {c.name}
                                                </div>
                                                <span className="crew-job">
                                                    {c.job}
                                                </span>
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
                        margin-bottom: 10px;
                        font-weight: bold;
                        font-size: 16px;
                    }

                    .movie-description {
                        padding-bottom: 20px;
                        font-size: 14px;
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
                    .crew-job {
                        font-size: 12px;
                    }
                `}
            </style>
        </section>
    )
}
