import Topbar from '../components/topbar'
import { withNamespaces } from '../i18n'
import axios from 'axios'
import Router from 'next/router'
import UserPop from '../components/user-popup'
import PageWidth from '../components/page-width'
import RoomNumber from '../components/room-number'
import { pusherConnection } from '../lib/pusher-connection'
import validateRoom from '../lib/room-redirect'
import { ROOM_STATES } from '../lib/constants'
import Loader from '../components/loader'

import copy from 'copy-to-clipboard'

class WaitingRoom extends React.Component {
    constructor(props) {
        super(props)

        this.shareRoom = this.shareRoom.bind(this)
        this.setReady = this.setReady.bind(this)

        this.state = {
            users: [],
            showPage: false,
            showShareTooltip: false,
            ready: false,
        }
    }

    async componentDidMount() {
        const roomR = await axios.get(`/api/room/${this.props.roomId}`)
        let { room } = roomR.data

        if (!validateRoom(room, ROOM_STATES.WAITING_ROOM)) {
            return
        }

        this.setState({
            loaded: true,
        })

        this.pusher = pusherConnection()

        this.channel = this.pusher.subscribe(`room-${this.props.roomId}`)

        this.channel.bind('users', users => {
            this.setState({
                users,
            })
        })

        this.channel.bind('room-ready', () => {
            Router.push(`/configure-room?id=${this.props.roomId}`)
        })

        this.setState({
            users: room.users,
        })
    }

    componentWillUnmount() {
        if (this.pusher) {
            //this.pusher.unsubscribe(`room-${this.props.roomId}`);
        }
    }

    shareRoom() {
        const url = `${location.origin}/room?id=${this.props.roomId}`

        if (navigator.share) {
            return navigator.share({
                title: 'Movie Match',
                text: `Room ${this.props.roomId}`,
                url,
            })
        }

        copy(url)

        this.setState({ showShareTooltip: true })

        setTimeout(() => {
            this.setState({ showShareTooltip: false })
        }, 1000)
    }

    setReady() {
        this.setState({ ready: true })

        axios.post(`/api/room/ready/${this.props.roomId}`)
    }

    render() {
        const TopBarForPage = <Topbar showMenu={false} />

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
                        <div className="align-center top-area">
                            <PageWidth className="mm-content-padding ">
                                <RoomNumber roomId={this.props.roomId} />
                                <div className="share-info">
                                    {this.props.t('invite-friends-to-room')}
                                    <br />
                                    {this.props.t(
                                        'share-the-room-number-or-use-invite'
                                    )}
                                </div>

                                <button
                                    onClick={this.shareRoom}
                                    className="mm-small-btn"
                                >
                                    {this.state.showShareTooltip && (
                                        <span className="mm-tooltip share-tooltip ">
                                            {this.props.t(
                                                'link-copied-send-friends'
                                            )}
                                        </span>
                                    )}
                                    {this.props.t('invite-friends-btn')}
                                </button>
                            </PageWidth>
                        </div>
                        <PageWidth className="mm-content-padding ">
                            <div className="align-center">
                                <div className="room-users">
                                    <div>
                                        {this.props.t('people-in-the-room')}
                                    </div>
                                    {this.state.users.map(user => (
                                        <div
                                            className="user-info"
                                            key={user.id}
                                        >
                                            {user.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div />
                        </PageWidth>
                    </div>
                    <div className="continue-container">
                        {!this.state.ready && (
                            <PageWidth className="mm-content-padding ">
                                {this.state.users.length === 1 && (
                                    <div className="alone-message">
                                        <b>{this.props.t('you-are-alone')}</b>
                                        <br />
                                        {this.props.t(
                                            'mm-is-better-with-friends'
                                        )}
                                    </div>
                                )}
                                <button
                                    onClick={this.setReady}
                                    className="continue-button"
                                >
                                    {this.props.t('room-is-ready')}
                                </button>
                                <div className="continue-information">
                                    {this.props.t(
                                        'after-everyone-press-button'
                                    )}
                                </div>
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

                    .share-info {
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

                    b {
                        font-weight: bold;
                    }

                    .title {
                        font-size: 20px;
                        margin-bottom: 20px;
                        margin-top: 20px;
                    }

                    .room-users {
                        margin-top: 20px;
                    }

                    .user-info {
                        font-weight: bold;
                    }

                    .continue-button {
                        width: auto;
                        margin-top: 20px;
                        font-weight: bold;
                        border: 1px solid #ffdb6e;
                        background: #ffdb6e;
                        outline: none;
                        cursor: pointer;
                        padding: 10px;
                        min-width: 200px;
                        border-radius: 4px;
                        color: #333;
                        text-transform: uppercase;
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
                        background: #ffdb6e;
                        padding: 20px;
                    }
                `}</style>
            </div>
        )
    }

    static async getInitialProps({ query }) {
        const roomId = query.id && query.id.toUpperCase()
        return { roomId, namespacesRequired: ['common'] }
    }
}

export default withNamespaces('common')(WaitingRoom)
