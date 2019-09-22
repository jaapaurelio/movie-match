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
        }

        this.onChangeId = this.onChangeId.bind(this)
        this.join = this.join.bind(this)
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
                    newGroupPage={false}
                    title="Movie Match"
                />

                <PageWidth>

                    <Title
                        title={`Hi ${this.state.username}, what are you looking for?`}>
                    </Title>

                    <div className="options-container create-group-container">


                        <div className="create-group-btn-container">
                            <button
                                onClick={this.createGroup}
                                className="mm-btn start-btn "
                            >
                                {//this.props.t('create-group-btn')
                                }
                                Find a movie to watch</button>
                        </div>
                    </div>
                    <div className="options-container">
                        <div>
                            {/*
                            <input
                                className="group-input"
                                type="text"
                                placeholder="xxxx"
                                maxLength="4"
                                onChange={this.onChangeId}
                            />*/}
                            <div>
                                <button
                                    className="mm-btn start-btn join-btn"
                                    onClick={this.join}
                                >
                                    { // this.props.t('join-btn')
                                    }
                                    Join a group
                                </button>
                            </div>
                        </div>
                        <div className="info">
                            {//this.props.t('ask-group-number')
                            }
                        </div>
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

                    .start-btn {
                        width: 250px;
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
