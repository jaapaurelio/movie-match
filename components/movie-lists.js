export default ({ movieLists }) => (
    <section>
        <div className="lists-container">
            {movieLists.map(function(movieList, i) {
                return (
                    <div className="list" key={i}>
                        <div className="list-title">{movieList.title}</div>

                        <div className="posters">
                            {movieList.posters.map(function(poster) {
                                return (
                                    <img
                                        className="poster-img"
                                        src={poster}
                                    ></img>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
        <style jsx>{`
            .lists-container {
            }
            .list {
                margin: 20px;
            }
            .posters {
                border-radius: 10px;
                overflow: hidden;
                line-height: 1;
            }
            .poster-img {
                width: 25%;
            }
            .list-title {
                font-size: 24px;
                margin-bottom: 10px;
            }
        `}</style>
    </section>
)
