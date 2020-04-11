import Topbar from '../components/topbar'
import MovieInfo from '../components/movie-info'
import Cast from '../components/cast'
import MatchPopup from '../components/match-popup'
import SwipeArea from '../components/swipe-area'
import Loader from '../components/loader'
import axios from 'axios'
import Router from 'next/router'
import PageWidth from '../components/page-width'
import GroupInfoBar from '../components/group-info-bar'
import jsCookie from 'js-cookie'
import { GROUP_STATES } from '../lib/constants'
import { pusherConnection } from '../lib/pusher-connection'
import validateGroup from '../lib/group-redirect'
import UserPop from '../components/user-popup'
import { withNamespaces } from '../i18n'
import { sortMovies } from '../lib/sort-movies'
import MovieHead from '../components/movie-head'

const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('284941729ae99106f71e56126227659b')

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.like = this.like.bind(this)
        this.noLike = this.noLike.bind(this)
        this.onClickMatches = this.onClickMatches.bind(this)
        this.share = this.share.bind(this)
        this.loadMoreMovies = this.loadMoreMovies.bind(this)

        this.state = {
            movie: null,
            movies: [],
            loading: true,
            matched: false,
            showMatchPopup: false,
            users: [],
            info: {},
            group: {},
            showShareButton: false,
            loaded: false,
            userConfiguration: {},
        }
    }

    async loadMoreMovies() {
        const baseQuery = {
            'vote_count.gte': 500,
            'primary_release_date.gte': `${this.state.userConfiguration.startYear}-01-01`,
            'primary_release_date.lte': `${this.state.userConfiguration.endYear}-12-30`,
            'vote_average.gte': this.state.userConfiguration.ratingGte,
            'vote_average.lte': this.state.userConfiguration.ratingLte,
            with_genres: this.state.userConfiguration.selectedGenres.join('|'),
        }
        const page = this.state.userConfiguration.page + 1

        this.loadingMoreMovies = true

        const moviesListResponse = await moviedb.discoverMovie({
            ...baseQuery,
            page,
        })

        const movies = moviesListResponse.results.map(movie => {
            return {
                id: movie.id,
                title: movie.title,
            }
        })

        await axios.post(
            `/api/methods?api=add-movies-to-group&groupId=${this.props.groupId}`,
            {
                movies,
                page,
                totalPages: moviesListResponse.total_pages,
            }
        )

        this.setState({
            userConfiguration: { ...this.state.userConfiguration, page: page },
        })

        this.loadingMoreMovies = false
    }

    moviesForUser(movies, userId) {
        return movies.filter(movie => movie.usersRecomendation.includes(userId))
    }

    async getNewMovie(movies) {
        const movie = movies.shift()

        if (!movie) {
            return this.setState({
                movie: null,
                movies: [],
            })
        }

        this.setState({
            movie,
            movies,
        })

        // first movie has no data
        if (!movie.fullyLoaded) {
            const movieInfo = await moviedb.movieInfo(movie.id, {
                append_to_response: 'credits',
            })

            if (this.state.movie && this.state.movie.id === movieInfo.id) {
                this.setState({
                    movie: {
                        ...this.state.movie,
                        ...movieInfo,
                        fullyLoaded: true,
                    },
                })
            }
        }

        const userId = jsCookie.get('userId')

        if (
            this.moviesForUser(movies, userId).length < 5 &&
            !this.loadingMoreMovies
        ) {
            this.loadMoreMovies()
        }

        const nextMovie = movies[movies.length - 1]

        if (!nextMovie) return

        moviedb
            .movieInfo(nextMovie.id, {
                append_to_response: 'credits',
            })
            .then(movie => {
                const nextMovies = this.state.movies

                if (!movie) {
                    return
                }

                const movieIndex = nextMovies.findIndex(m => m.id == movie.id)

                nextMovies[movieIndex] = {
                    ...nextMovies[movieIndex],
                    ...movie,
                    fullyLoaded: true,
                }

                this.preloadImages(nextMovies[movieIndex])

                this.setState({
                    movies: nextMovies,
                })
            })
    }

    getRecomendations(movieId) {
        return moviedb
            .movieRecommendations({ id: movieId })
            .then(recomendations => {
                if (recomendations && recomendations.results) {
                    axios.post(
                        `/api/methods?api=add-movies-to-group&groupId=${this.props.groupId}`,
                        {
                            movies: recomendations.results,
                        }
                    )
                }
            })
    }

    postLike(like) {
        const movieId = this.state.movie.id
        like = like ? 'like' : 'nolike'
        axios.post(
            `api/methods?api=like&groupId=${this.props.groupId}&movieId=${movieId}&like=${like}`
        )
    }

    like() {
        this.postLike(true)
        this.getRecomendations(this.state.movie.id)

        this.getNewMovie(this.state.movies)
        window.scrollTo(0, 0)
    }

    noLike() {
        this.postLike(false)

        this.getNewMovie(this.state.movies)
        window.scrollTo(0, 0)
    }

    addNewMovies(newMovies) {
        const userId = jsCookie.get('userId')

        const allMoviesMap = this.state.movies.reduce((acc, movie) => {
            acc[movie.id] = movie
            return acc
        }, {})

        // update new
        Object.values(newMovies).forEach(movie => {
            allMoviesMap[movie.id] = movie
        })

        const movies = sortMovies(allMoviesMap, userId, this.state.movie)

        this.setState({
            movies,
        })

        if (!this.state.movie) {
            this.getNewMovie(movies)
        }
    }

    share() {
        if (navigator.share) {
            const url = `${location.origin}/group?id=${this.props.groupId}`
            navigator.share({
                title: 'Movie Match',
                text: `Group ${this.props.groupId}`,
                url,
            })
        }
    }

    async componentDidMount() {
        if (navigator.share) {
            this.setState({ showShareButton: true })
        }

        const moviesR = await axios.get(
            `/api/methods?api=get-group&groupId=${this.props.groupId}`
        )
        let { group } = moviesR.data

        if (!validateGroup(group, GROUP_STATES.MATCHING)) {
            return
        }

        this.setState({
            loaded: true,
        })

        this.pusher = pusherConnection()

        const userId = jsCookie.get('userId')

        this.channel = this.pusher.subscribe(`group-${this.props.groupId}`)

        this.channel.bind('movie-matched', matches => {
            this.setState({
                matched: true,
                showMatchPopup: true,
            })
        })

        this.channel.bind('best-match-updated', percentage => {
            this.setState({
                group: {
                    ...this.state.group,
                    bestMatch: percentage,
                },
            })
        })

        this.channel.bind('users', users => {
            this.setState({
                users,
            })
        })

        this.channel.bind('new-movies', this.addNewMovies.bind(this))

        const matched = group.state === GROUP_STATES.MATCHED
        let movies = group.movies

        this.setState({
            matched,
            users: group.users,
            group,
            userConfiguration: group.configurationByUser[userId],
        })

        if (!movies) {
            return
        }

        movies = sortMovies(movies, userId, this.state.movie)

        this.setState({ movies })

        await this.getNewMovie(movies)

        this.setState({
            loading: false,
        })
    }

    componentWillUnmount() {
        if (this.pusher) {
            this.pusher.unsubscribe(`group-${this.props.groupId}`)
        }
    }

    onClickMatches() {
        this.setState({ showMatchPopup: false })
        Router.push(`/matches?id=${this.props.groupId}`)
    }

    preloadImages(movie) {
        const poster = [
            `https://image.tmdb.org/t/p/w116_and_h174_bestv2/${movie.poster_path}`,
        ]

        const cast = movie.credits.cast
            .slice(0, 5)
            .map(
                actor =>
                    `https://image.tmdb.org/t/p/w240_and_h266_face/` +
                    actor.profile_path
            )

        const toPreload = [...poster, ...cast]

        toPreload.map(src => {
            const image = new Image()
            image.src = src
        })
    }

    static async getInitialProps({ query }) {
        const groupId = query.id && query.id.toUpperCase()
        return { groupId, namespacesRequired: ['common'] }
    }

    render() {
        const { movie, showMatchPopup } = this.state
        const TopBarForPage = (
            <Topbar
                groupPage={true}
                activetab="group"
                groupId={this.props.groupId}
                showGroupOptions={true}
                bestMatch={this.state.group.bestMatch}
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
                {TopBarForPage}
                <GroupInfoBar
                    shareBtn={this.share}
                    showShare={this.state.showShareButton}
                    users={this.state.users}
                    groupId={this.props.groupId}
                />
                {this.state.users.length == 1 && (
                    <div className="alone-msg">
                        <PageWidth className="mm-content-padding">
                            {this.props.t('you-are-alone-group')}
                            <br />
                            {this.props.t('mm-better-with-friends')}
                            <br />
                            {this.props.t('no-matches-will-be-done')}
                        </PageWidth>
                    </div>
                )}
                {movie && movie.fullyLoaded && (
                    <div>
                        <SwipeArea>
                            <div className="main-info-bg">
                                <MovieHead movie={movie} />
                            </div>
                            <PageWidth>
                                <div className="mm-content-padding movie-description">
                                    <h3 className="title title-overview">
                                        {this.props.t('overview')}
                                    </h3>
                                    {movie.overview}
                                </div>
                                <Cast
                                    t={this.props.t}
                                    cast={movie.credits.cast.slice(0, 5)}
                                />
                            </PageWidth>
                            <MovieInfo movie={movie} />
                        </SwipeArea>
                        <div className="buttons-container-space" />
                        <div className="buttons-container-bg">
                            <PageWidth>
                                <div className="buttons-container">
                                    <div
                                        onClick={this.noLike}
                                        className="button-choice button-no"
                                    >
                                        {this.props.t('not-today-btn')}
                                    </div>
                                    <div
                                        onClick={this.like}
                                        className="button-choice button-yes"
                                    >
                                        {this.props.t('yes-btn')}
                                    </div>
                                </div>
                            </PageWidth>
                        </div>
                    </div>
                )}
                {this.state.loading && <Loader />}
                <PageWidth>
                    {!movie && !this.state.loading && (
                        <div className="mm-big-message">
                            {this.props.t('no-more-movies-to-show')}
                        </div>
                    )}
                </PageWidth>
                <MatchPopup
                    show={showMatchPopup}
                    onClickMatches={this.onClickMatches}
                />
                <style jsx>
                    {`
                        .share-btn {
                            width: auto;
                            padding: 2px 4px;
                            border: 0;
                            border: 1px solid #fedc6e;
                            color: #333;
                            border-radius: 4px;
                            font-size: 12px;
                            flex-shrink: 0;
                            margin-bottom: 0px;
                            margin-top: 6px;
                        }

                        .title {
                            padding-top: 20px;
                            margin-bottom: 10px;
                            font-weight: bold;
                            font-size: 16px;
                        }
                        .main-info-bg {
                            background: #ffdb6e;
                        }

                        .movie-description {
                            padding-bottom: 20px;
                            font-size: 14px;
                            line-height: 1.5;
                        }

                        .group-code-alone {
                            margin-top: 6px;
                            font-weight: bold;
                        }

                        .group-id {
                            background: #333333;
                            color: #72a3b3;
                            text-align: center;
                            font-size: 11px;
                            padding-bottom: 10px;
                            font-weight: bold;
                        }

                        .buttons-container-bg {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background: #fff;
                        }

                        .buttons-container {
                            text-align: center;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 4px;
                        }

                        .buttons-container-space {
                            margin-top: 100px;
                        }

                        .button-no {
                            background: #333;
                            cursor: pointer;
                            margin-right: 2px;
                        }

                        .button-yes {
                            background: #06baa8;
                            cursor: pointer;
                            margin-left: 2px;
                        }

                        .button-choice {
                            user-select: none;
                            padding: 15px 0;
                            color: #fff;
                            text-transform: uppercase;
                            font-size: 12px;
                            width: 50%;
                            font-weight: bold;
                            border-radius: 4px;
                            box-shadow: 0px 1px 2px 0px #00000094;
                        }

                        .alone-msg {
                            padding-top: 6px;
                            padding-bottom: 6px;
                            background: #a0e3ff;
                            font-size: 12px;
                            text-align: center;
                        }
                    `}
                </style>
            </div>
        )
    }
}

export default withNamespaces('common')(Index)
