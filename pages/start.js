import Topbar from '../components/topbar'
import Link from 'next/link'
import Router from 'next/router'
import PageWidth from '../components/page-width'
import Headline from '../components/headline'
import UserPop from '../components/user-popup'
import Title from '../components/title'
import { withNamespaces } from '../i18n'
import jsCookie from 'js-cookie'
import { connect } from 'react-redux'
import axios from 'axios'

class Start extends React.Component {
    constructor(props) {
        super(props)

        const language = jsCookie.get('i18next') || 'en'

        this.state = {
            groupId: undefined,
            lastGroupId: undefined,
            username: '',
            language,
            showGroupInput: false
        }

        this.onChangeId = this.onChangeId.bind(this)
        this.join = this.join.bind(this)
        this.showGroupInput = this.showGroupInput.bind(this)
        this.createGroup = this.createGroup.bind(this)
        this.changeLanguage = this.changeLanguage.bind(this)
    }

    changeLanguage(event) {
        jsCookie.set('i18next', event.target.value)
        location.reload()
    }

    onChangeId(event) {
        this.setState({ groupId: event.target.value })
    }

    join() {
        if (this.state.groupId) {
            Router.push(`/waiting-group?id=${this.state.groupId}`)
        }
    }

    showGroupInput() {
        this.setState({showGroupInput: true})
    }

    componentDidMount() {
        const lastGroupId = jsCookie.get('groupId')
        var username = localStorage.getItem('username')

        this.setState({ lastGroupId, username })
    }

    async createGroup() {
        if (this.state.creatingGroup) return

        this.setState({ creatingGroup: true })
        const groupResponse = await axios.post('/api/create-group')
        this.setState({ creatingGroup: false })

        Router.push(`/waiting-group?id=${groupResponse.data.groupId}`)
    }

    render() {
        return (
            <div>
                <Topbar
                    groupId={this.state.lastGroupId}
                    title="Movie Match"
                />

                <PageWidth>

                    <Title
                        title={`${this.props.t('hi')} ${this.state.username} ${this.props.t('what-looking-for')}`}>
                    </Title>

                    <div className="options-container create-group-container">


                        <div className="create-group-btn-container">
                            <button
                                onClick={this.createGroup}
                                className="mm-btn start-btn "
                            >
                                {this.props.t('find-a-movie')}
                                </button>
                        </div>
                    </div>
                    <div className="options-container">
                        {!this.state.showGroupInput && <div>
                            <button
                                className="mm-btn start-btn join-btn"
                                onClick={this.showGroupInput}
                            >
                                {this.props.t('join-a-group')}
                            </button>
                        </div>
                        }

                        {this.state.showGroupInput && <div>

                            <div>
                            <div className="group-name-label">{this.props.t('group-name')}</div>
                            <input
                                className="group-input"
                                type="text"
                                placeholder="X X X X X"
                                maxLength="4"
                                onChange={this.onChangeId}
                            />
                            </div>

                            <button
                                className="mm-btn start-btn join-btn"
                                onClick={this.join}
                            >
                                {this.props.t('join-btn')}
                            </button>
                        </div>
                        }

                    </div>

                    <div className="how-to-link">
                        <Link href="/intro">
                            <a>{this.props.t('how-to-use')}</a>
                        </Link>
                    </div>
                </PageWidth>

                <div className="language-container">
                    <select
                        value={this.state.language}
                        onChange={this.changeLanguage}
                    >
                        <option value="en">English</option>
                        <option value="es">Espanõl</option>
                        <option value="pt">Português</option>
                    </select>
                </div>

                <footer>
                    {this.props.t('movie-details-provided-by')}{' '}
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
                    }

                    .group-name-label {
                        font-size: 12px;
                        margin-bottom: 6px;
                    }

                    .join-btn {
                        background: transparent;
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

    static getInitialProps() {
        const pageProps = { namespacesRequired: ['common']};

        return pageProps;
    }
}

export default withNamespaces('common')(Start);
