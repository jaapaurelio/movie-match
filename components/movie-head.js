import PageWidth from './page-width'

const getRuntime = min => {
    if (!min) {
        return ''
    }
    const h = Math.floor(min / 60)
    const m = min % 60
    return h + 'h' + m + 'm'
}

export default ({ movie, small }) => {
    const imageClass = small ? 'movie-poster-small' : 'movie-poster'
    return (
        <div>
            <PageWidth>
                <div className="main-info">
                    <img
                        className={imageClass}
                        src={
                            'https://image.tmdb.org/t/p/w116_and_h174_bestv2/' +
                            movie.poster_path
                        }
                    />
                    <div className="info-row">
                        <span className="movie-title">{movie.title}</span>
                        &nbsp;
                        <span className="movie-year">
                            ({movie.release_date.split('-')[0]})
                        </span>
                        {movie.title != movie.original_title && (
                            <div className="original-title">
                                {movie.original_title} &#8226;&nbsp;
                                {movie.original_language}
                            </div>
                        )}
                        <div>
                            <span className="gender">
                                {movie.genres.map(genre => genre.name + ', ')}
                            </span>
                        </div>
                        <div className="small-info">
                            <i className="far fa-star info-icon score-icon" />
                            <span className="score">{movie.vote_average}</span>
                            <span className="score-small">/10</span>

                            {!!movie.runtime && (
                                <span>
                                    <i className="far info-icon fa-clock" />
                                    <span className="time">
                                        {' '}
                                        {getRuntime(movie.runtime)} &nbsp;
                                    </span>
                                </span>
                            )}
                            {movie.adult && (
                                <span className="more-18">+18</span>
                            )}
                        </div>
                    </div>
                </div>
            </PageWidth>
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

                    .score-small {
                        color: #9e7c00;
                        font-size: 12px;
                        margin-right: 8px;
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
                        border-radius: 4px;
                    }

                    .movie-poster-small {
                        height: 100px;
                        margin-left: 10px;
                        border-radius: 4px;
                    }

                    .main-info {
                        padding: 10px 0;
                        position: relative;

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

                    .original-title {
                        font-size: 12px;
                        color: #8a6c00;
                        margin-top: 4px;
                    }

                    .gender {
                        display: inline-block;
                        margin-right: 4px;
                        padding: 0 2px;
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
                `}
            </style>
        </div>
    )
}
