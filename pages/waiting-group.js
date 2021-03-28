import * as React from 'react'
import Topbar from '../components/topbar'
import { withNamespaces } from '../i18n'
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

import copy from 'copy-to-clipboard'

class WaitingGroup extends React.Component {
    constructor(props) {
        super(props)

        this.shareGroup = this.shareGroup.bind(this)
        this.setReady = this.setReady.bind(this)

        this.state = {
            users: [],
            showPage: false,
            showShareTooltip: false,
            ready: false,
        }
    }

    async componentDidMount() {
        const groupR = await axios.get(
            `/api/methods?api=get-group&groupId=${this.props.groupId}`
        )
        let { group } = groupR.data

        if (!validateGroup(group, GROUP_STATES.WAITING_GROUP)) {
            return
        }

        this.setState({
            loaded: true,
        })

        this.pusher = pusherConnection()

        this.channel = this.pusher.subscribe(`group-${this.props.groupId}`)

        this.channel.bind('users', users => {
            this.setState({
                users,
            })
        })

        this.channel.bind('group-ready', () => {
            Router.push(`/configure-group?id=${this.props.groupId}`)
        })

        this.setState({
            users: group.users,
        })
    }

    componentWillUnmount() {
        if (this.pusher) {
            //this.pusher.unsubscribe(`group-${this.props.groupId}`);
        }
    }

    shareGroup() {
        const url = `${location.origin}/group?id=${this.props.groupId}`

        if (navigator.share) {
            return navigator.share({
                title: 'Movie Match',
                text: `Group ${this.props.groupId}`,
                url,
            })
        }

        copy(url)

        this.setState({ showShareTooltip: true })

        setTimeout(() => {
            this.setState({ showShareTooltip: false })
        }, 3000)
    }

    setReady() {
        this.setState({ ready: true })

        axios.post(
            `/api/methods?api=set-group-ready&groupId=${this.props.groupId}`
        )
    }

    render() {
        const TopBarForPage = (
            <Topbar
                showMenu={true}
                groupId={this.props.groupId}
                groupPage={true}
                showGroup={true}
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
                <div className="page-container">
                    {TopBarForPage}
                    <div className="page-content">
                        <PageWidth>
                            <Title
                                title={this.props.t('who-will-watch')}
                                subtitle={this.props.t('time-to-invite')}
                            ></Title>
                        </PageWidth>
                        <div className="align-center top-area">
                            <PageWidth className="mm-content-padding ">
                                <button
                                    onClick={this.shareGroup}
                                    className="mm-btn mm-btn-line btn-invite"
                                >
                                    {this.props.t('invite')}
                                </button>
                                {this.state.showShareTooltip && (
                                    <span className="mm-tooltip share-tooltip ">
                                        {this.props.t(
                                            'link-copied-send-friends'
                                        )}
                                    </span>
                                )}
                                <GroupNumber groupId={this.props.groupId} />
                            </PageWidth>
                        </div>
                        <PageWidth className="mm-content-padding ">
                            <div>
                                <div className="group-users">
                                    <div className="sub-title">
                                        {this.props.t('people-in-group')}
                                    </div>
                                    {this.state.users.map((user, index) => (
                                        <span
                                            className="user-info"
                                            key={user.id}
                                        >
                                            {index != 0 ? ', ' : ' '}
                                            {user.id == jsCookie.get('userId')
                                                ? this.props.t('you')
                                                : `${user.name}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </PageWidth>

                        {false && this.state.users.length === 1 && (
                            <div className="alone-message">
                                <b>{this.props.t('you-are-alone')}</b>
                                <br />
                                {this.props.t('mm-is-better-with-friends')}
                            </div>
                        )}
                    </div>

                    <FixedFooter>
                        <div className="continue-container">
                            {!this.state.ready && (
                                <PageWidth className="mm-content-padding ">
                                    {this.state.users.length > 1 && (
                                        <button
                                            onClick={this.setReady}
                                            className="continue-button mm-btn mm-btn-accept"
                                        >
                                            {this.props.t('everyone-is-ready')}
                                        </button>
                                    )}

                                    {this.state.users.length <= 1 && (
                                        <button
                                            disabled="disabled"
                                            className="continue-button mm-btn"
                                        >
                                            {this.props.t(
                                                'waiting-for-friends-btn'
                                            )}
                                        </button>
                                    )}

                                    <div className="continue-alone">
                                        <span onClick={this.setReady}>
                                            {this.props.t('watch-alone')}
                                        </span>
                                    </div>
                                </PageWidth>
                            )}

                            {this.state.ready && (
                                <div className="continue-information">
                                    {this.props.t('waiting-for-friends')}
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

    static async getInitialProps({ query }) {
        const groupId = query.id && query.id.toUpperCase()
        return { groupId, namespacesRequired: ['common'] }
    }
}

export default withNamespaces('common')(WaitingGroup)
