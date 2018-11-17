
export default ({movie}) => (
    <section>
        props: {JSON.stringify(movie)}
        <div className="movie-backdrop">
            <img src="https://image.tmdb.org/t/p/w700_and_h392_bestv2/bHarw8xrmQeqf3t8HpuMY7zoK4x.jpg" />
        </div>
        <div className="main-info">
            <img className="movie-poster" src="https://image.tmdb.org/t/p/w174_and_h261_bestv2/y31QB9kn3XSudA15tV7UWQ9XLuW.jpg" />
            <div className="info-row">
                <span className="movie-title">
                    {movie.title}
                </span>
                &nbsp;
                <span className="movie-year">
                    (2018)
                </span>
                <div>
                    <span className="gender">
                        Action, Science Fiction, Adventure
                    </span>
                </div>
                <span className="time">2h 1m &nbsp;</span>
                <span className="more-18">+18</span>

            </div>
        </div>

        <div className="content-padding movie-description">
            <h3>Overview</h3>
            {movie.overview}
            <div>
                <br/>
                <strong>James Gunn</strong>
                <br/>Director
            </div>
        </div>

        <div className="content-padding actors-container">
            <h3>Cast</h3>

            <div className="actors">
                <div className="actor-container">
                    <img className="actor-image" src="https://image.tmdb.org/t/p/w240_and_h266_face/gXKyT1YU5RWWPaE1je3ht58eUZr.jpg" />
                    <div className="actor-name">Chris Pratt</div>
                    <div className="actor-persona">Peter Quill / Star-Lord</div>
                </div>
                <div className="actor-container">
                    <img className="actor-image" src="https://image.tmdb.org/t/p/w240_and_h266_face/ofNrWiA2KDdqiNxFTLp51HcXUlp.jpg" />
                    <div className="actor-name">Zoe Saldana</div>
                    <div className="actor-persona">Gamora</div>
                </div>
            </div>
        </div>

        <div className="buttons-container-space"></div>
        <div className="buttons-container">
            <div>
                <div className="button-choice button-no">
                    Not today
                </div>
                <div className="button-choice button-yes">
                    Yes please
                </div>
            </div>
        </div>

        <style jsx>{`
            .buttons-container {
                position: fixed;
                bottom: 0;
                background: #f9fcff;
                left: 0;
                right: 0;
                border-top: 1px solid #e8ebef;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .buttons-container-space {
                margin-top: 100px;
            }

            .button-no {
                background: #ff565e;
                cursor: pointer;
            }

            .button-yes {
                background: #00e390;
                cursor: pointer;
            }

            .button-choice {
                padding: 6px 20px;
                display: inline-block;
                margin: 20px;
                border-radius: 4px;
                color: #FFF;
                text-transform: uppercase;
                font-size: 12px;

            }
        `}
        </style>

        <style jsx>{`
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

        <style jsx>{`
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
