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
import jsCookie from 'js-cookie';

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
        const groupR = await axios.get(`/api/group/${this.props.groupId}`)
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

        axios.post(`/api/group/ready/${this.props.groupId}`)
    }

    render() {
        const TopBarForPage = <Topbar showMenu={true} groupId={this.props.groupId} groupPage={true} />

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
                            title={this.props.t(
                                'who-will-watch'
                            )}
                            subtitle={this.props.t(
                                'time-to-invite'
                            )} >
                        </Title>

                        </PageWidth>
                        <div className="align-center top-area">
                            <PageWidth className="mm-content-padding ">
                                <button
                                    onClick={this.shareGroup}
                                    className="mm-small-btn"
                                >
                                    {this.state.showShareTooltip && (
                                        <span className="mm-tooltip share-tooltip ">
                                            {this.props.t(
                                                'link-copied-send-friends'
                                            )}
                                        </span>
                                    )}

                                    {this.props.t('invite')}
                                </button>
                                <GroupNumber groupId={this.props.groupId} />
                            </PageWidth>
                        </div>
                        <PageWidth className="mm-content-padding ">
                            <div>
                                <div className="group-users">
                                    <div className="sub-title">{this.props.t('people-in-group')}</div>
                                    {this.state.users.map((user, index) => (
                                        <span
                                            className="user-info"
                                            key={user.id}
                                        >
                                        {index != 0 ? ', ': ' '}
                                        { user.id == jsCookie.get('userId') ? this.props.t('you'): `${user.name}`}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </PageWidth>
                    </div>

                    <div className="continue-container">

                    {this.state.users.length === 1 && (
                                <div className="alone-message">
                                    <b>{this.props.t('you-are-alone')}</b>
                                    <br />
                                    {this.props.t(
                                        'mm-is-better-with-friends'
                                    )}
                                </div>
                            )}


                        {!this.state.ready && (
                            <PageWidth className="mm-content-padding ">
                                <button
                                    onClick={this.setReady}
                                    className="continue-button mm-btn"
                                >
                                    Continue
                                </button>
                            </PageWidth>
                        )}

                        {this.state.ready && (
                            <div className="continue-information">
                                {this.props.t('waiting-for-friends')}
                            </div>
                        )}
                    </div>
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
                    }

                    .user-info {
                    }

                    .continue-button {
                        margin-top: 20px;
                        margin-bottom: 40px;
                        width: 100%;
                    }

                    .continue-container {
                        text-align: center;
                        bottom: 40px;
                        margin-top: 40px;
                        flex-shrink: 0;
                    }

                    .page-container {
                        height: 100vh;
                        align-items: stretch;
                        flex-direction: column;
                        display: flex;
                    }

                    .page-content {
                        flex-grow: 1;
                    }

                    .top-area {
                        margin: 0 20px 40px 20px;
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
