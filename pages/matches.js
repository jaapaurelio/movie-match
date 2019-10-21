import axios from 'axios'
import PageWidth from '../components/page-width'
import Topbar from '../components/topbar'
import Headline from '../components/headline'
import MovieHead from '../components/movie-head'
import Loader from '../components/loader'
import GroupInfoBar from '../components/group-info-bar'
import Link from 'next/link'

import UserPop from '../components/user-popup'
import { withNamespaces } from '../i18n'
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

        const wait = group.matches.map(movieId => {
            return moviedb.movieInfo(movieId)
        })

        const matches = await Promise.all(wait)

        this.setState({ group, matches, loading: false, loaded: true })
    }

    static getInitialProps({ query }) {
        return { groupId: query.id, namespacesRequired: ['common'] }
    }

    render() {
        const TopBarForPage = (
            <Topbar
                matchesPage={true}
                activetab="group"
                groupId={this.props.groupId}
                showGroupOptions={true}
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
                            groupId={this.props.groupId}
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

                            <PageWidth>
                                <h1 className="title">
                                    {this.props.t('perfect-match')}
                                </h1>
                                <div className="movie-container perfect-match">
                                    <MovieHead movie={this.state.matches[0]} />
                                </div>

                                {!!this.state.matches[1] && (
                                    <div className="other-options">
                                        <h1 className="title">
                                            {this.props.t(
                                                'alternative-matches'
                                            )}
                                        </h1>
                                        {this.state.matches.map((movie, i) => {
                                            {
                                                return (
                                                    i != 0 && (
                                                        <div
                                                            className="movie-container"
                                                            key={movie.id}
                                                        >
                                                            <MovieHead
                                                                movie={movie}
                                                            />
                                                        </div>
                                                    )
                                                )
                                            }
                                        })}
                                    </div>
                                )}
                            </PageWidth>
                        </div>
                    )}

                    {this.state.loaded && !this.state.matches.length && (
                        <PageWidth>
                            <div className="title">
                                {this.props.t('no-matches-yet')}
                            </div>
                        </PageWidth>
                    )}
                    <PageWidth>
                        <div className="keep-searching-container">
                            <Link href={`/group?id=${this.props.groupId}`}>
                                <span className="mm-small-btn">
                                    {this.props.t('continue-searching')}
                                </span>
                            </Link>
                        </div>
                    </PageWidth>
                </div>

                <style jsx>{`
                    .title {
                        font-size: 22px;
                        font-weight: 800;
                        padding: 20px 20px 10px 20px;
                    }

                    .movie-container {
                        padding: 0 10px;
                    }

                    .keep-searching-container {
                        text-align: center;
                        margin-top: 40px;
                        margin-bottom: 40px;
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
