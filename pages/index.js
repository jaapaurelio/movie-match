import React, { useState, useEffect } from 'react'

import Topbar from '../components/topbar'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Router from 'next/router'
import PageWidth from '../components/page-width'
import UserPop from '../components/user-popup'
import Title from '../components/title'
import jsCookie from 'js-cookie'
import axios from 'axios'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

function Start() {
    const { t } = useTranslation('common')
    const router = useRouter()

    const [state, setState] = useState({
        groupId: undefined,
        lastGroupId: undefined,
        username: '',
        language: router.locale,
        showGroupInput: false,
    })

    function changeLanguage(event) {
        const locale = event.target.value
        router.push('/', undefined, { locale })
    }

    function onChangeId(event) {
        setState({ ...state, groupId: event.target.value })
    }

    function join() {
        if (state.groupId) {
            Router.push(`/waiting-group?id=${state.groupId}`)
        }
    }

    function showGroupInput() {
        setState({ ...state, showGroupInput: true })
    }

    async function createGroup() {
        if (state.creatingGroup) return

        setState({ ...state, creatingGroup: true })
        const groupResponse = await axios.post(
            '/api/methods?api=create-group',
            {},
            {
                withCredentials: true,
            }
        )
        setState({ ...state, creatingGroup: false })

        Router.push(`/waiting-group?id=${groupResponse.data.groupId}`)
    }

    useEffect(() => {
        const lastGroupId = jsCookie.get('groupId')
        var username = localStorage.getItem('username')

        setState({ ...state, lastGroupId, username })
    }, [])

    return (
        <div>
            <Topbar
                showGroup={true}
                groupId={state.lastGroupId}
                title="Movie Match"
            />

            <PageWidth>
                <Title
                    title={`${t('hi')} ${state.username}${t(
                        'what-looking-for'
                    )}`}
                ></Title>

                <div className="options-container create-group-container">
                    <div className="create-group-btn-container">
                        <button
                            onClick={createGroup}
                            className="mm-btn start-btn "
                        >
                            {t('find-a-movie')}
                        </button>
                    </div>
                </div>
                <div className="options-container">
                    {!state.showGroupInput && (
                        <div>
                            <button
                                className="mm-btn mm-btn-line start-btn"
                                onClick={showGroupInput}
                            >
                                {t('join-a-group')}
                            </button>
                        </div>
                    )}

                    {state.showGroupInput && (
                        <div>
                            <div>
                                <div className="group-name-label">
                                    {t('group-name')}
                                </div>
                                <input
                                    className="group-input"
                                    type="text"
                                    placeholder="X X X X X"
                                    maxLength="4"
                                    onChange={onChangeId}
                                />
                            </div>

                            <button
                                className="mm-btn start-btn mm-btn-line"
                                onClick={join}
                            >
                                {t('join-btn')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="how-to-link">
                    <Link href="/how-to-use">
                        <a>{t('how-to-use')}</a>
                    </Link>
                </div>
            </PageWidth>

            <div className="language-container">
                <select value={state.language} onChange={changeLanguage}>
                    <option value="en">English</option>
                    <option value="es">Espanõl</option>
                    <option value="pt">Português</option>
                </select>
            </div>

            <footer>
                {t('movie-details-provided-by')}{' '}
                <a href="https://www.themoviedb.org" target="_blank">
                    themoviedb
                </a>
                .
            </footer>

            <UserPop />

            <style jsx>{`
                .start-btn,
                .group-input {
                    width: 250px;
                    margin-bottom: 6px;
                }

                .group-name-label {
                    font-size: 12px;
                    margin-bottom: 6px;
                }

                .username {
                    text-decoration: underline;
                }

                .info {
                    font-size: 12px;
                    text-align: center;
                    margin-top: 10px;
                }

                .step-details {
                    font-size: 16px;
                }
                .step-details:not(:first-child) {
                    margin-top: 10px;
                }

                .options-container {
                    margin: 40px 20px;
                    text-align: center;
                }

                footer {
                    text-align: center;
                    font-size: 12px;
                    margin-top: 40px;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    padding: 5px;
                }

                footer a {
                    color: #333;
                }

                .how-to-link {
                    margin-top: 80px;
                    text-align: center;
                }

                .how-to-link a {
                    color: #333;
                    font-size: 12px;
                }
                .language-container {
                    text-align: center;
                    margin-top: 40px;
                }
            `}</style>
        </div>
    )
}

export default Start

export const getStaticProps = async ({ locale }) => {
    const a = await serverSideTranslations(locale)
    return {
        props: {
            ...a,
        },
    }
}
