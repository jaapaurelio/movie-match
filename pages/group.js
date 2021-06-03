import React, { useState, useEffect } from 'react'

import Topbar from '../components/topbar'
import MovieInfo from '../components/movie-info'
import MovieVideo from '../components/movie-video'
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
import { sortMovies } from '../lib/sort-movies'
import MovieHead from '../components/movie-head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { MovieDb } from 'moviedb-promise'
const moviedb = new MovieDb('284941729ae99106f71e56126227659b')

function getMovieTrailerKey(videos = []) {
    const results = videos.results || []
    const trailer =
        results.find((video) => video.type === 'Trailer') || results[0] || {}

    return trailer.key
}

function Group(props) {
    const { t } = useTranslation('common')

    const [state, setState] = useState({
        movie: null,
        movies: [],
        loading: true,
        showMatchPopup: false,
        users: [],
        info: {},
        group: {},
        showShareButton: false,
        groupLoaded: false,
        userConfiguration: {},
        loadingMoreMovies: false,
    })

    async function loadMoreMovies() {
        const baseQuery = {
            'vote_count.gte': 500,
            'primary_release_date.gte': `${state.userConfiguration.startYear}-01-01`,
            'primary_release_date.lte': `${state.userConfiguration.endYear}-12-30`,
            'vote_average.gte': state.userConfiguration.ratingGte,
            'vote_average.lte': state.userConfiguration.ratingLte,
            with_genres: state.userConfiguration.selectedGenres.join('|'),
        }
        const page = state.userConfiguration.page + 1

        setState((state) => ({ ...state, loadingMoreMovies: true }))

        const moviesListResponse = await moviedb.discoverMovie({
            ...baseQuery,
            page,
        })

        const movies = moviesListResponse.results.map((movie) => {
            return {
                id: movie.id,
                title: movie.title,
            }
        })

        await axios.post(
            `/api/methods?api=add-movies-to-group&groupId=${props.groupId}`,
            {
                movies,
                page,
                totalPages: moviesListResponse.total_pages,
            }
        )

        setState((state) => ({
            ...state,
            userConfiguration: {
                ...state.userConfiguration,
                page: page,
                loadingMoreMovies: false,
            },
        }))
    }

    function moviesForUser(movies, userId) {
        return movies.filter((movie) =>
            movie.usersRecomendation.includes(userId)
        )
    }

    async function getNewMovie(movies) {
        const movie = movies.shift()

        if (!movie) {
            return setState((state) => ({ ...state, movie: null, movies: [] }))
        }

        setState((state) => ({ ...state, movie, movies }))

        if (!movie.fullyLoaded) {
            const movieInfo = await moviedb.movieInfo({
                id: movie.id,
                append_to_response: 'credits,videos',
            })

            setState((state) => {
                if (state.movie && state.movie.id === movieInfo.id) {
                    return {
                        ...state,
                        movie: {
                            ...state.movie,
                            ...movieInfo,
                            fullyLoaded: true,
                        },
                    }
                }
                return state
            })
        }

        const userId = jsCookie.get('userId')

        if (
            moviesForUser(movies, userId).length < 5 &&
            !state.loadingMoreMovies
        ) {
            loadMoreMovies()
        }

        const nextMovie = movies[movies.length - 1]

        if (!nextMovie) return

        moviedb
            .movieInfo({
                id: nextMovie.id,
                append_to_response: 'credits,videos',
            })
            .then((movie) => {
                if (!movie) {
                    return
                }

                setState((state) => {
                    const nextMovies = state.movies

                    const movieIndex = nextMovies.findIndex(
                        (m) => m.id == movie.id
                    )

                    nextMovies[movieIndex] = {
                        ...nextMovies[movieIndex],
                        ...movie,
                        fullyLoaded: true,
                    }

                    preloadImages(nextMovies[movieIndex])

                    return { ...state, movies: nextMovies }
                })
            })
    }

    function getRecomendations(movieId) {
        return moviedb
            .movieRecommendations({ id: movieId })
            .then((recomendations) => {
                if (recomendations && recomendations.results) {
                    axios.post(
                        `/api/methods?api=add-movies-to-group&groupId=${props.groupId}`,
                        {
                            movies: recomendations.results,
                        }
                    )
                }
            })
    }

    function postLike(like) {
        const movieId = state.movie.id
        like = like ? 'like' : 'nolike'
        axios.post(
            `api/methods?api=like&groupId=${props.groupId}&movieId=${movieId}&like=${like}`
        )
    }

    function like() {
        postLike(true)
        getRecomendations(state.movie.id)

        getNewMovie(state.movies)
        window.scrollTo(0, 0)
    }

    function noLike() {
        postLike(false)

        getNewMovie(state.movies)
        window.scrollTo(0, 0)
    }

    function addNewMovies(newMovies) {
        setState((state) => {
            const userId = jsCookie.get('userId')

            const allMoviesMap = state.movies.reduce((acc, movie) => {
                acc[movie.id] = movie
                return acc
            }, {})

            // update new
            Object.values(newMovies).forEach((movie) => {
                allMoviesMap[movie.id] = movie
            })

            const movies = sortMovies(allMoviesMap, userId, state.movie)

            if (!state.movie) {
                getNewMovie(movies)
            }

            return { ...state, movies }
        })
    }

    function share() {
        if (navigator.share) {
            const url = `${location.origin}/group?id=${props.groupId}`
            navigator.share({
                title: 'Movie Match',
                text: `Group ${props.groupId}`,
                url,
            })
        }
    }

    useEffect(() => {
        console.log(JSON.parse(JSON.stringify(state)))
    })

    useEffect(() => {
        if (navigator.share) {
            setState((state) => ({ ...state, showShareButton: true }))
        }
    })

    useEffect(() => {
        ;(async () => {
            const moviesR = await axios.get(
                `/api/methods?api=get-group&groupId=${props.groupId}`
            )
            let { group } = moviesR.data

            if (!validateGroup(group, GROUP_STATES.MATCHING)) {
                return
            }

            const userId = jsCookie.get('userId')

            setState((state) => ({
                ...state,
                users: group.users,
                group,
                userConfiguration: group.configurationByUser[userId],
                groupLoaded: true,
            }))

            if (!group.movies) {
                return
            }

            let movies = sortMovies(group.movies, userId)

            setState((state) => ({ ...state, movies }))

            await getNewMovie(movies)

            setState((state) => ({ ...state, loading: false }))
        })()
    }, [])

    useEffect(() => {
        let pusher
        ;(async () => {
            pusher = pusherConnection()

            const channel = pusher.subscribe(`group-${props.groupId}`)

            channel.bind('movie-matched', async (data) => {
                const { matches } = data
                const matchMovieId = matches[matches.length - 1]
                const movieInfo = await moviedb.movieInfo({
                    id: matchMovieId,
                })

                setState((state) => ({
                    ...state,
                    showMatchPopup: true,
                    matchPoster: movieInfo.poster_path,
                }))
            })

            channel.bind('best-match-updated', (percentage) => {
                setState((state) => ({
                    ...state,
                    group: {
                        ...state.group,
                        bestMatch: percentage,
                    },
                }))
            })

            channel.bind('users', (users) => {
                setState((state) => ({ ...state, users }))
            })

            channel.bind('new-movies', addNewMovies)
        })()

        return function cleanup() {
            if (pusher) {
                pusher.unsubscribe(`group-${props.groupId}`)
            }
        }
    }, [])

    function onClickMatches() {
        setState((state) => ({ ...state, showMatchPopup: false }))
        Router.push(`/matches?id=${props.groupId}`)
    }

    function preloadImages(movie) {
        const poster = [
            `https://image.tmdb.org/t/p/w116_and_h174_bestv2/${movie.poster_path}`,
        ]

        const cast = movie.credits.cast
            .slice(0, 5)
            .map(
                (actor) =>
                    `https://image.tmdb.org/t/p/w240_and_h266_face/` +
                    actor.profile_path
            )

        const toPreload = [...poster, ...cast]

        toPreload.map((src) => {
            const image = new Image()
            image.src = src
        })
    }

    const { movie, showMatchPopup, matchPoster } = state
    const TopBarForPage = (
        <Topbar
            groupPage={true}
            activetab="group"
            groupId={props.groupId}
            showGroupOptions={true}
            bestMatch={state.group.bestMatch}
        />
    )
    if (!state.groupLoaded) {
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
                shareBtn={share}
                showShare={state.showShareButton}
                users={state.users}
                groupId={props.groupId}
            />
            {state.users.length == 1 && (
                <div className="alone-msg">
                    <PageWidth className="mm-content-padding">
                        {t('you-are-alone-group')}
                        <br />
                        {t('mm-better-with-friends')}
                        <br />
                        {t('no-matches-will-be-done')}
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
                                    {t('overview')}
                                </h3>
                                {movie.overview}
                            </div>
                            <Cast t={t} cast={movie.credits.cast.slice(0, 5)} />
                        </PageWidth>

                        <MovieInfo movie={movie} />
                        <PageWidth>
                            <div className="mm-content-padding">
                                <MovieVideo
                                    youtubeKey={getMovieTrailerKey(
                                        movie.videos
                                    )}
                                ></MovieVideo>
                            </div>
                        </PageWidth>
                    </SwipeArea>
                    <div className="buttons-container-space" />
                    <div className="buttons-container-bg">
                        <PageWidth>
                            <div className="buttons-container">
                                <div
                                    onClick={noLike}
                                    className="button-choice button-no"
                                >
                                    {t('not-today-btn')}
                                </div>
                                <div
                                    onClick={like}
                                    className="button-choice button-yes"
                                >
                                    {t('yes-btn')}
                                </div>
                            </div>
                        </PageWidth>
                    </div>
                </div>
            )}
            {state.loading && <Loader />}
            <PageWidth>
                {!movie && !state.loading && (
                    <div className="mm-big-message">
                        {t('no-more-movies-to-show')}
                    </div>
                )}
            </PageWidth>
            <MatchPopup
                show={showMatchPopup}
                poster={matchPoster}
                onClickMatches={onClickMatches}
                onClickDismiss={() => {
                    setState((state) => ({
                        ...state,
                        showMatchPopup: false,
                        matchPoster: undefined,
                    }))
                }}
                t={t}
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

export default Group

export const getServerSideProps = async ({ locale, query }) => {
    const translations = await serverSideTranslations(locale)
    const groupId = query.id && query.id.toUpperCase()
    return {
        props: {
            ...translations,
            groupId,
        },
    }
}
