import React from 'react'
import Topbar from '../components/topbar'
import Link from 'next/link'
import { withNamespaces } from '../i18n'

class ErrorPage extends React.Component {
    static getInitialProps({ res, err }) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null
        return { statusCode, namespacesRequired: ['common'] }
    }

    render() {
        return (
            <div>
                <Topbar />
                <div className="error">
                    {this.props.t('sorry-page-not-found')}
                </div>
                <div className="home-link">
                    <div className="mm-btn">
                        <Link href={`/`}>
                            <a>{this.props.t('go-to-home-btn')}</a>
                        </Link>
                    </div>
                </div>
                <style jsx>{`
                    .error {
                        text-align: center;
                        margin-top: 40px;
                    }

                    .home-link {
                        margin-top: 20px;
                        text-align: center;
                    }
                `}</style>
            </div>
        )
    }
}

export default withNamespaces('common')(ErrorPage)
