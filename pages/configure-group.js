import React, { useState, useEffect } from 'react'

import Topbar from '../components/topbar'
import { MovieDb } from 'moviedb-promise'
import axios from 'axios'
import Router from 'next/router'
import PageWidth from '../components/page-width'
import Title from '../components/title'
import { pusherConnection } from '../lib/pusher-connection'
import validateGroup from '../lib/group-redirect'
import { GROUP_STATES } from '../lib/constants'
import Loader from '../components/loader'
import UserPop from '../components/user-popup'
import FixedBottom from '../components/fixed-bottom'
import jsCookie from 'js-cookie'
import randomInt from 'random-int'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const moviedb = new MovieDb('284941729ae99106f71e56126227659b')

function CreateGroup(props) {
    const { t } = useTranslation('common')

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    const years = []
    for (let i = 1950; i <= currentYear; i = i + 10) {
        years.push(i)
    }

    // Make sure current year is the last one
    years[years.length - 1] = currentYear

    const ratings = [
        { id: 0, label: t('bad-movies') },
        { id: 1, label: t('good-movies') },
    ]

    const [state, setState] = useState({
        genres: props.genres || [],
        errorMessages: [],
        startYear: 2000,
        endYear: currentYear,
        rating: 1,
        waitingUsers: false,
        loaded: false,
        isMoreConfigurationsVisible: false,
        page: randomInt(3, 7),
        errorTime: undefined,
    })

    const constants = {
        years,
        ratings,
    }

    function showMoreConfigurations() {
        setState({ ...state, isMoreConfigurationsVisible: true })
    }

    function submitForm() {
        const selectedGenres = state.genres
            .filter((genre) => genre.selected)
            .map((genre) => genre.id)

        const errorMessages = []

        if (state.startYear >= state.endYear) {
            errorMessages.push(t('invalid-years'))
        }

        if (!selectedGenres.length) {
            errorMessages.push(t('please-select-genre'))
        }

        if (errorMessages.length > 0) {
            return showErrors(errorMessages)
        }

        createGroup({
            selectedGenres,
            startYear: state.startYear,
            endYear: state.endYear,
            rating: state.rating,
        })
    }

    function showErrors(errorMessages) {
        if (state.errorTimer) {
            clearTimeout(errorTimer)
            setState((state) => ({ ...state, errorTime: null }))
        }

        const errorTime = setTimeout(() => {
            setState((state) => ({
                ...state,
                errorMessages: [],
                errorTime: null,
            }))
        }, 2000)

        setState((state) => ({ ...state, errorMessages, errorTime }))
    }

    async function createGroup({ selectedGenres, startYear, endYear, rating }) {
        const groupId = props.groupId
        let ratingGte = 1
        let ratingLte = 10

        if (rating == 0) {
            ratingLte = 6
        }

        if (rating == 1) {
            ratingGte = 7
        }

        const baseQuery = {
            'vote_count.gte': 500,
            'primary_release_date.gte': `${startYear}-01-01`,
            'primary_release_date.lte': `${endYear}-12-30`,
            'vote_average.gte': ratingGte,
            'vote_average.lte': ratingLte,
            with_genres: selectedGenres.join('|'),
        }

        setState({ ...state, waitingUsers: true })

        const moviesListResponse = await moviedb.discoverMovie({
            ...baseQuery,
            page: state.page,
        })

        const movies = moviesListResponse.results.map((movie) => {
            return {
                id: movie.id,
                title: movie.title,
            }
        })

        axios.post(
            `/api/methods?api=add-movies-configuration&groupId=${groupId}`,
            {
                movies,
                config: {
                    ratingLte,
                    ratingGte,
                    startYear,
                    endYear,
                    selectedGenres,
                    page: state.page,
                    totalPages: moviesListResponse.total_pages,
                },
            }
        )
    }

    function toggleGenre(id) {
        const genres = state.genres.map((genre) => {
            if (genre.id === id) {
                return {
                    ...genre,
                    selected: !genre.selected,
                }
            }

            return genre
        })

        setState({ ...state, genres })
    }

    useEffect(() => {
        let pusher
        ;(async () => {
            const userId = jsCookie.get('userId')
            const groupR = await axios.get(
                `/api/methods?api=get-group&groupId=${props.groupId}`
            )

            let { group } = groupR.data

            if (!validateGroup(group, GROUP_STATES.CONFIGURING)) {
                return
            }

            setState((state) => ({ ...state, loaded: true }))

            const userHasConfig = group.configurationByUser[userId]

            if (userHasConfig) {
                return setState((state) => ({ ...state, waitingUsers: true }))
            }

            pusher = pusherConnection()

            const channel = pusher.subscribe(`group-${props.groupId}`)

            channel.bind('configuration-done', () => {
                setState((state) => ({ ...state, loaded: false }))
                Router.push(`/group?id=${props.groupId}`)
            })
        })()

        return function cleanup() {
            if (pusher) {
                pusher.unsubscribe(`group-${props.groupId}`)
            }
        }
    }, [])

    const TopBarForPage = (
        <Topbar
            showMenu={false}
            showGroup={true}
            groupId={props.groupId}
            groupPage={true}
        />
    )

    if (!state.loaded) {
        return (
            <div>
                {TopBarForPage}
                <Loader />
                <UserPop />
            </div>
        )
    }

    return (
        <div className="root-container">
            {TopBarForPage}
            {!state.waitingUsers && (
                <div>
                    <PageWidth>
                        <Title title={t('what-kind-of-movie-you-like')}></Title>
                        <div className="mm-content-padding">
                            <div className="form-title">
                                {t('movie-genres')}
                            </div>
                            <div className="genres-container">
                                {state.genres.map((genre) => {
                                    return (
                                        <div
                                            key={genre.id}
                                            className="checkbox-m"
                                        >
                                            <label
                                                className={
                                                    genre.selected
                                                        ? 'selected'
                                                        : ''
                                                }
                                                onClick={() =>
                                                    toggleGenre(genre.id)
                                                }
                                            >
                                                {genre.name}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>

                            {!state.isMoreConfigurationsVisible && (
                                <div
                                    className="mm-text-btn show-more"
                                    onClick={showMoreConfigurations}
                                >
                                    {t('show-more-config-group-options')}
                                </div>
                            )}

                            {state.isMoreConfigurationsVisible && (
                                <div>
                                    <div className="form-title">
                                        {t('rating')}
                                    </div>
                                    <div className="two-selects-row">
                                        <select
                                            className="select-m"
                                            defaultValue={state.rating}
                                            onChange={(event) => {
                                                setState({
                                                    ...state,
                                                    rating: event.target.value,
                                                })
                                            }}
                                        >
                                            {constants.ratings.map(
                                                (rating, i) => {
                                                    return (
                                                        <option
                                                            key={rating.id}
                                                            value={rating.id}
                                                        >
                                                            {rating.label}
                                                        </option>
                                                    )
                                                }
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-title">
                                        {t('from-year')}
                                    </div>
                                    <div className="two-selects-row">
                                        <select
                                            className="select-m"
                                            defaultValue={state.startYear}
                                            onChange={(event) => {
                                                setState({
                                                    ...state,
                                                    startYear:
                                                        event.target.value,
                                                })
                                            }}
                                        >
                                            {constants.years.map((year, i) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                        <span className="two-to">
                                            {t('to')}
                                        </span>
                                        <select
                                            className="select-m"
                                            defaultValue={state.endYear}
                                            onChange={(event) => {
                                                setState({
                                                    ...state,
                                                    endYear: event.target.value,
                                                })
                                            }}
                                        >
                                            {constants.years.map((year, i) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {!!state.errorMessages.length && (
                                <div className="toast-error-container">
                                    <div className="toast-error">
                                        {state.errorMessages.map((message) => (
                                            <span key={message}>
                                                {message} <br />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </PageWidth>
                    <FixedBottom>
                        <PageWidth className="mm-content-padding">
                            <div className="create-group-btn-container">
                                <button
                                    onClick={submitForm}
                                    className="mm-btn create-group-btn"
                                >
                                    {t('next-btn')}
                                </button>
                            </div>
                        </PageWidth>
                    </FixedBottom>
                </div>
            )}

            {state.waitingUsers && (
                <div className="waiting-users-container">
                    <PageWidth>
                        <div className="waiting-title">
                            {t('waiting-for-friends-config')}
                        </div>
                    </PageWidth>
                </div>
            )}

            <style jsx>
                {`
                    .waiting-users-container {
                        padding-top: 20px;
                    }
                    .waiting-title {
                        margin-top: 10px;
                        padding: 20px;
                        text-align: center;
                    }
                    .container {
                        padding: 0 10px;
                    }

                    .show-more {
                        margin-top: 20px;
                        text-align: right;
                    }

                    .description-container {
                        margin-bottom: 20px;
                    }

                    .description {
                        padding: 20px;
                    }

                    .form-title {
                        font-size: 16px;
                        margin: 20px 0 10px;
                    }

                    .two-selects-row {
                        display: flex;
                        justify-content: center;
                        flex-direction: row;
                        align-items: center;
                    }

                    .two-to {
                        padding: 0 10px;
                    }

                    .select-m {
                        width: 100%;
                        padding: 10px;
                        box-sizing: border-box;
                        font-size: 14px;
                        color: #333;
                    }

                    .genres-container {
                        display: flex;
                        flex-wrap: wrap;
                    }

                    .checkbox-m {
                        display: inline-block;
                        user-select: none;
                        box-sizing: content-box;
                        flex: 1 1 auto;
                    }

                    .select-all {
                        width: 100%;
                        text-align: center;
                    }

                    .checkbox-m input {
                        position: absolute;
                        left: -9999px;
                    }

                    .checkbox-m label {
                        padding: 10px;
                        border: 1px solid #b7b7b7;
                        border-radius: 4px;
                        font-size: 14px;
                        cursor: pointer;
                        display: block;
                        margin: 4px;
                        background: #fff;
                    }

                    .checkbox-m label.selected {
                        background: #fff5bc;
                        border-color: #f3e077;
                    }

                    .create-group-btn-container {
                        text-align: right;
                        background: #fff;
                    }

                    .create-group-btn {
                        margin: 20px 0;
                        width: 100%;
                    }

                    .toast-error-container {
                        position: fixed;
                        z-index: 2;
                        top: 50px;
                        left: 0;
                        right: 0;
                        justify-content: center;
                        align-items: center;
                        display: flex;
                    }

                    .toast-error {
                        background: #f78a88;
                        color: #fff;
                        font-size: 12px;
                        padding: 10px;
                        border-radius: 4px;
                        text-align: center;
                        box-sizing: content-box;
                        width: 80%;
                    }
                `}
            </style>
        </div>
    )
}

export const getServerSideProps = async ({ locale, query }) => {
    const groupId = query.id && query.id.toUpperCase()
    const genreMovieList = await moviedb.genreMovieList({ language: locale })

    const genres = genreMovieList.genres.map((genre) => ({
        ...genre,
        selected: false,
    }))
    const a = await serverSideTranslations(locale)
    return {
        props: {
            ...a,
            genres,
            groupId,
        },
    }
}

export default CreateGroup
