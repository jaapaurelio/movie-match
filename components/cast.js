const Cast = ({ cast, t }) => (
    <div className="actors-container">
        <h3 className="mm-content-padding">{t('cast')}</h3>
        <div className="actors">
            {cast.map(actor => (
                <div key={actor.id} className="actor-container">
                    <img
                        className="actor-image"
                        src={
                            actor.profile_path
                                ? `https://image.tmdb.org/t/p/w240_and_h266_face/${actor.profile_path}`
                                : '/mmicon.png'
                        }
                    />
                    <div className="actor-name">{actor.name}</div>
                    <div className="actor-character">{actor.character}</div>
                </div>
            ))}
        </div>

        <style jsx>
            {`
                h3 {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                strong {
                    font-weight: bold;
                }

                .actors {
                    display: flex;
                    width: 100%;
                    overflow-x: auto;
                }

                .actor-container {
                    margin-top: 10px;
                    padding-right: 10px;
                }

                .actor-container:first-child {
                    padding-left: 10px;
                }

                .actor-image {
                    width: 100px;
                    border-radius: 6px;
                }

                .actor-name {
                    font-size: 12px;
                    font-weight: bold;
                }

                .actor-character {
                    font-size: 12px;
                }
            `}
        </style>
    </div>
)

export default Cast
