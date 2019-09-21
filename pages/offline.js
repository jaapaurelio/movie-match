import Topbar from '../components/topbar'
import { withNamespaces } from '../i18n'

class Offline extends React.Component {
    constructor(props) {
        super(props)
        this.reload = this.reload.bind(this)
    }

    reload() {
        location.reload()
    }

    render() {
        return (
            <div>
                <Topbar />
                <div className="offline">
                    {this.props.t('intro-1')}
                    <br />
                    {this.props.t('please-try-again')}
                </div>
                <div className="try-button">
                    <button onClick={this.reload} className="mm-btn">
                        {this.props.t('try-again-btn')}
                    </button>
                </div>

                <style jsx>{`
                    .offline {
                        margin-top: 40px;
                        text-align: center;
                    }
                    .try-button {
                        margin-top: 20px;
                        text-align: center;
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

export default withNamespaces('common')(Offline)
