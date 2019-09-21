import axios from 'axios'
import PageWidth from '../components/page-width'
import Topbar from '../components/topbar'
import Headline from '../components/headline'
import MovieHead from '../components/movie-head'
import Loader from '../components/loader'
import RoomInfoBar from '../components/room-info-bar'
import { ROOM_STATES } from '../lib/constants'
import UserPop from '../components/user-popup'
import { withNamespaces } from '../i18n'
import validateRoom from '../lib/room-redirect'
const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('284941729ae99106f71e56126227659b')

class Matches extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            matches: [],
            loading: true,
            room: {},
            loaded: false,
        }
    }

    async componentDidMount() {
        const moviesR = await axios.get(`/api/room/${this.props.roomId}`)
        let { room } = moviesR.data

        if (!validateRoom(room, ROOM_STATES.MATCHED)) {
            return
        }

        this.setState({
            loaded: true,
        })

        const wait = room.matches.map(movieId => {
            return moviedb.movieInfo(movieId)
        })

        const matches = await Promise.all(wait)

        this.setState({ room, matches, loading: false })
    }

    static getInitialProps({ query }) {
        return { roomId: query.id, namespacesRequired: ['common'] }
    }

    render() {
        const TopBarForPage = (
            <Topbar
                roomPage={true}
                activetab="room"
                roomId={this.props.roomId}
            />
        )

        if (!this.state.loaded) {
            return (
                <div>
                    {TopBarForPage}
                    <Loader />
                    <UserPop />
                </div>
            )
        }

        return (
            <div>
                <div>
                    {TopBarForPage}
                    {!this.state.loading && (
                        <RoomInfoBar
                            users={this.state.room.users}
                            room={this.state.room}
                        />
                    )}
                    {this.state.loading && <Loader />}
                    {!!this.state.matches.length && (
                        <div className="container">
                            <Headline>
                                {this.props.t('we-found-perfect-match')}
                                <br />
                                {this.props.t('have-nice-movie')}
                            </Headline>

                            <div>
                                <PageWidth>
                                    <h1 className="title">
                                        {this.props.t('perfect-match')}
                                    </h1>
                                </PageWidth>

                                <PageWidth>
                                    <div className="movie-container perfect-match">
                                        <MovieHead
                                            movie={this.state.matches[0]}
                                        />
                                    </div>
                                </PageWidth>

                                {!!this.state.matches[1] && (
                                    <div className="other-options">
                                        <PageWidth>
                                            <h1 className="title">
                                                {this.props.t(
                                                    'alternative-matches'
                                                )}
                                            </h1>
                                            {this.state.matches.map(
                                                (movie, i) => {
                                                    {
                                                        return (
                                                            i != 0 && (
                                                                <div
                                                                    className="movie-container"
                                                                    key={
                                                                        movie.id
                                                                    }
                                                                >
                                                                    <MovieHead
                                                                        movie={
                                                                            movie
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )
                                                    }
                                                }
                                            )}
                                        </PageWidth>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                    .title {
                        font-size: 14px;
                        padding: 20px 20px 10px 20px;
                        text-align: right;
                        font-weight: bold;
                    }

                    .movie-info {
                        padding-left: 20px;
                    }

                    .movie-title {
                        font-weight: bold;
                    }

                    .show-more-container {
                        text-align: center;
                        margin: 20px 0;
                    }

                    .other-options {
                        background: #fafafa;
                        margin-top: 20px;
                        border-top: 1px solid #eaeaea;
                    }

                    .info-message {
                        text-align: center;
                        padding-top: 20px;
                    }
                `}</style>
            </div>
        )
    }
}

export default withNamespaces('common')(Matches)
