import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PageWidth from '../components/page-width'
import Topbar from '../components/topbar'
import Headline from '../components/headline'
import MovieHead from '../components/movie-head'
import Loader from '../components/loader'
import GroupInfoBar from '../components/group-info-bar'
import Link from 'next/link'

import UserPop from '../components/user-popup'
import { MovieDb } from 'moviedb-promise'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const moviedb = new MovieDb('284941729ae99106f71e56126227659b')

function Matches(props) {
    const { t } = useTranslation('common')

    const [state, setState] = useState({
        matches: [],
        loading: true,
        group: {},
        loaded: false,
    })

    useEffect(() => {
        ;(async () => {
            const moviesR = await axios.get(
                `/api/methods?api=get-group&groupId=${props.groupId}`
            )
            let { group } = moviesR.data

            const getMatches = group.matches.map((movie) => {
                return moviedb.movieInfo(movie.id)
            })

            const matches = await Promise.all(getMatches)

            setState((state) => ({
                ...state,
                group,
                matches,
                loading: false,
                loaded: true,
            }))
        })()
    }, [])

    const TopBarForPage = (
        <Topbar
            t={t}
            matchesPage={true}
            activetab="group"
            groupId={props.groupId}
            showGroupOptions={true}
            bestMatch={state.group.bestMatch}
        />
    )

    if (!state.loaded) {
        return (
            <div>
                {TopBarForPage}
                <Loader />
                <UserPop t={t} />
            </div>
        )
    }

    return (
        <div>
            <div>
                {TopBarForPage}
                {!state.loading && (
                    <GroupInfoBar
                        users={state.group.users}
                        groupId={props.groupId}
                    />
                )}
                {state.loading && <Loader />}
                {state.group.bestMatch == 100 && (
                    <div className="container">
                        <Headline>
                            {t('we-found-perfect-match')}
                            <br />
                            {t('have-nice-movie')}
                        </Headline>
                        <PageWidth>
                            <h1 className="title">{t('perfect-match')}</h1>
                            <div className="movie-container perfect-match">
                                <MovieHead movie={state.matches[0]} />
                            </div>
                            {!!state.matches[1] && (
                                <div className="other-options">
                                    {state.group.bestMatch === 100 && (
                                        <h1 className="title">
                                            {t('alternative-matches')}
                                        </h1>
                                    )}
                                    {state.matches.map((movie, i) => {
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

                {state.group.bestMatch < 100 && state.group.bestMatch > 0 && (
                    <div>
                        <PageWidth>
                            <h1 className="title">
                                {t('almost-matched', {
                                    percentage: state.group.bestMatch,
                                })}
                            </h1>
                        </PageWidth>
                        {state.matches.map((movie, i) => {
                            {
                                return (
                                    <div
                                        className="movie-container"
                                        key={movie.id}
                                    >
                                        <MovieHead movie={movie} small={true} />
                                    </div>
                                )
                            }
                        })}
                    </div>
                )}

                {state.loaded && !state.matches.length && (
                    <PageWidth>
                        <div className="title">{t('no-matches-yet')}</div>
                    </PageWidth>
                )}
                <PageWidth>
                    <div className="keep-searching-container">
                        <Link href={`/group?id=${props.groupId}`}>
                            <span className="mm-small-btn">
                                {t('continue-searching')}
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

export default Matches
