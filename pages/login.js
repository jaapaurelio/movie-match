import Link from 'next/link'
import Router from 'next/router'
import PageWidth from '../components/page-width'
import Headline from '../components/headline'
import UserPop from '../components/user-popup'
import { withNamespaces } from '../i18n'
import jsCookie from 'js-cookie'
import { connect } from 'react-redux'
import axios from 'axios'

class Start extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <PageWidth>
                    <h1>Welcome back</h1>
                    <Link href="/start">
                        <div className="close-btn">Close</div>
                    </Link>

                    <div className="login-btn-container">
                        <a className="login-btn" href="/auth/facebook">
                            Sign In with Facebook
                        </a>
                    </div>

                    <div className="login-btn-container">
                        <a className="login-btn" href="/auth/google">
                            Sign In with Google
                        </a>
                    </div>

                    <Link href="/start">
                        <div className="close-page-link">Back to Home Page</div>
                    </Link>
                </PageWidth>
                <style jsx>{`
                    h1 {
                        margin: 20px;
                        font-size: 20px;
                    }
                    .close-btn {
                        position: absolute;
                        top: 0;
                        right: 20px;
                        cursor: pointer;
                    }
                    .login-btn-container {
                        text-align: center;
                    }
                    .login-btn {
                        padding: 10px;
                        border: 1px solid #484848;
                        border-radius: 4px;
                        margin: 10px;
                        display: inline-block;
                        font-weight: 600 !important;
                        font-size: 14px !important;
                        color: #484848;
                        text-decoration: none;
                    }
                    .close-page-link {
                        font-size: 12px;
                        text-align: center;
                        margin-top: 20px;
                        cursor: pointer;
                    }
                `}</style>
            </div>
        )
    }

    static getInitialProps() {
        return {
            namespacesRequired: ['common'],
        }
    }
}

function mapStateToProps(state) {
    const { user } = state
    return { userName: user.name }
}

export default connect(
    mapStateToProps,
    null
)(withNamespaces('common')(Start))
