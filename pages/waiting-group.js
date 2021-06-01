import React, { useState, useEffect } from 'react'

import Topbar from '../components/topbar'
import axios from 'axios'
import Router from 'next/router'
import UserPop from '../components/user-popup'
import PageWidth from '../components/page-width'
import GroupNumber from '../components/group-number'
import { pusherConnection } from '../lib/pusher-connection'
import validateGroup from '../lib/group-redirect'
import { GROUP_STATES } from '../lib/constants'
import Loader from '../components/loader'
import Title from '../components/title'
import FixedFooter from '../components/fixed-bottom'
import jsCookie from 'js-cookie'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import copy from 'copy-to-clipboard'

function WaitingGroup(props) {
    const { t } = useTranslation('common')

    const [state, setState] = useState({
        users: [],
        showPage: false,
        showShareTooltip: false,
        ready: false,
        loaded: false,
    })

    useEffect(() => {
        let pusher
        ;(async () => {
            const groupR = await axios.get(
                `/api/methods?api=get-group&groupId=${props.groupId}`
            )
            let { group } = groupR.data

            if (!validateGroup(group, GROUP_STATES.WAITING_GROUP)) {
                return
            }

            setState((state) => ({ ...state, loaded: true }))

            pusher = pusherConnection()

            const channel = pusher.subscribe(`group-${props.groupId}`)

            channel.bind('users', (users) => {
                setState((state) => ({ ...state, users }))
            })

            channel.bind('group-ready', () => {
                Router.push(`/configure-group?id=${props.groupId}`)
            })

            setState((state) => ({ ...state, users: group.users }))
        })()

        return function cleanup() {
            if (pusher) {
                pusher.unsubscribe(`group-${props.groupId}`)
            }
        }
    }, [])

    function shareGroup() {
        const url = `${location.origin}/group?id=${props.groupId}`

        if (navigator.share) {
            return navigator.share({
                title: 'Movie Match',
                text: `Group ${props.groupId}`,
                url,
            })
        }

        copy(url)

        setState({ ...state, showShareTooltip: true })

        setTimeout(() => {
            setState({ ...state, showShareTooltip: false })
        }, 3000)
    }

    function setReady() {
        setState({ ...state, ready: true })

        axios.post(`/api/methods?api=set-group-ready&groupId=${props.groupId}`)
    }

    const TopBarForPage = (
        <Topbar
            showMenu={true}
            groupId={props.groupId}
            groupPage={true}
            showGroup={true}
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
        <div>
            <div className="page-container">
                {TopBarForPage}
                <div className="page-content">
                    <PageWidth>
                        <Title
                            title={t('who-will-watch')}
                            subtitle={t('time-to-invite')}
                        ></Title>
                    </PageWidth>
                    <div className="align-center top-area">
                        <PageWidth className="mm-content-padding ">
                            <button
                                onClick={shareGroup}
                                className="mm-btn mm-btn-line btn-invite"
                            >
                                {t('invite')}
                            </button>
                            {state.showShareTooltip && (
                                <span className="mm-tooltip share-tooltip ">
                                    {t('link-copied-send-friends')}
                                </span>
                            )}
                            <GroupNumber groupId={props.groupId} />
                        </PageWidth>
                    </div>
                    <PageWidth className="mm-content-padding ">
                        <div>
                            <div className="group-users">
                                <div className="sub-title">
                                    {t('people-in-group')}
                                </div>
                                {state.users.map((user, index) => (
                                    <span className="user-info" key={user.id}>
                                        {index != 0 ? ', ' : ' '}
                                        {user.id == jsCookie.get('userId')
                                            ? t('you')
                                            : `${user.name}`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </PageWidth>

                    {false && state.users.length === 1 && (
                        <div className="alone-message">
                            <b>{t('you-are-alone')}</b>
                            <br />
                            {t('mm-is-better-with-friends')}
                        </div>
                    )}
                </div>

                <FixedFooter>
                    <div className="continue-container">
                        {!state.ready && (
                            <PageWidth className="mm-content-padding ">
                                {state.users.length > 1 && (
                                    <button
                                        onClick={setReady}
                                        className="continue-button mm-btn mm-btn-accept"
                                    >
                                        {t('everyone-is-ready')}
                                    </button>
                                )}

                                {state.users.length <= 1 && (
                                    <button
                                        disabled="disabled"
                                        className="continue-button mm-btn"
                                    >
                                        {t('waiting-for-friends-btn')}
                                    </button>
                                )}

                                <div className="continue-alone">
                                    <span onClick={setReady}>
                                        {t('watch-alone')}
                                    </span>
                                </div>
                            </PageWidth>
                        )}

                        {state.ready && (
                            <div className="continue-information">
                                {t('waiting-for-friends')}
                            </div>
                        )}
                    </div>
                </FixedFooter>
            </div>
            <style jsx>{`
                .alone-message {
                    background: aliceblue;
                    padding: 10px;
                    font-size: 14px;
                }

                .sub-title {
                    font-size: 22px;
                    font-weight: bold;
                }

                .share-info {
                    margin-top: 10px;
                    font-size: 14px;
                }

                .share-tooltip {
                    top: -40px;
                }

                .btn-invite {
                    background: #333;
                    color: #fff;
                    box-shadow: none;
                }

                .align-center {
                    text-align: center;
                }

                .continue-information {
                    text-align: center;
                    margin-top: 20px;
                    padding: 0 20px;
                    margin-bottom: 20px;
                    font-size: 14px;
                }

                .mm-small-btn {
                    margin-top: 0;
                }

                b {
                    font-weight: bold;
                }

                .group-users {
                    margin-top: 20px;
                    text-align: center;
                }

                .user-info {
                }

                .continue-button {
                    margin-top: 20px;
                    margin-bottom: 20px;
                    width: 100%;
                }

                .continue-alone {
                    font-size: 14px;
                    text-decoration: underline;
                    margin-bottom: 10px;
                    cursor: pointer;
                }

                .page-container {
                    min-height: 100vh;
                    background: #ffdb6e;
                }

                .page-content {
                    flex-grow: 1;
                }

                .top-area {
                    margin: 60px 20px 60px 20px;
                }

                .continue-container {
                    background: #ffdb6e;
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

export default WaitingGroup
