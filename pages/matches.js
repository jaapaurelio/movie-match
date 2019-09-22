import axios from 'axios'
import PageWidth from '../components/page-width'
import Topbar from '../components/topbar'
import Headline from '../components/headline'
import MovieHead from '../components/movie-head'
import Loader from '../components/loader'
import GroupInfoBar from '../components/group-info-bar'
import { GROUP_STATES } from '../lib/constants'
import UserPop from '../components/user-popup'
import { withNamespaces } from '../i18n'
import validateGroup from '../lib/group-redirect'
const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('284941729ae99106f71e56126227659b')

class Matches extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            matches: [],
            loading: true,
            group: {},
            loaded: false,
        }
    }

    async componentDidMount() {
        const moviesR = await axios.get(`/api/group/${this.props.groupId}`)
        let { group } = moviesR.data

        if (!validateGroup(group, GROUP_STATES.MATCHED)) {
            return
        }

        this.setState({
            loaded: true,
        })

        const wait = group.matches.map(movieId => {
            return moviedb.movieInfo(movieId)
        })

        const matches = await Promise.all(wait)

        this.setState({ group, matches, loading: false })
    }

    static getInitialProps({ query }) {
        return { groupId: query.id, namespacesRequired: ['common'] }
    }

    render() {
        const TopBarForPage = (
            <Topbar
                groupPage={true}
                activetab="group"
                groupId={this.props.groupId}
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
                        <GroupInfoBar
                            users={this.state.group.users}
                            group={this.state.group}
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
