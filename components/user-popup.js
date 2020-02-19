import { connect } from 'react-redux'
import { setUser } from '../state-manager/actions'
import axios from 'axios'
import { withNamespaces } from '../i18n'

class UserPopup extends React.Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)

        this.textInput = React.createRef()

        this.state = {
            showPopup: false,
        }
    }

    async handleClick() {
        if (this.textInput.current.value !== '') {
            const name = this.textInput.current.value

            await axios.post(`/api/user`, { name })

            localStorage.setItem('username', name)
            this.setState({ showPopup: false })

            location.reload()
        }
    }

    componentDidMount() {
        var user = localStorage.getItem('username')
        if (!user) {
            this.setState({ showPopup: true })
        }
    }

    render() {
        return (
            <div>
                {this.state.showPopup && (
                    <section className="container">
                        <div className="content">
                            {this.props.t('whats-you-name')}

                            <div>
                                <input
                                    className="name-input"
                                    ref={this.textInput}
                                    type="text"
                                />
                            </div>
                            <div>
                                <button
                                    className="mm-btn"
                                    onClick={this.handleClick}
                                >
                                    {this.props.t('save-btn')}
                                </button>
                            </div>
                        </div>
                        <style jsx>
                            {`
                                .container {
                                    position: fixed;
                                    background: #393939fa;
                                    left: 0;
                                    top: 0;
                                    bottom: 0;
                                    right: 0;
                                    display: flex;
                                    z-index: 4;
                                    align-items: center;
                                    justify-content: center;
                                }

                                .content {
                                    padding: 40px;
                                    background: #fff;
                                    border-radius: 4px;
                                }

                                .name-input {
                                    margin-top: 10px;
                                    margin-bottom: 10px;
                                    width: 100%;
                                    box-sizing: border-box;
                                    font-size: 14px;
                                    padding: 10px;
                                    border: 1px solid #b7b7b7;
                                    border-radius: 4px;
                                }
                            `}
                        </style>
                    </section>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { user } = state
    return { userName: user.name }
}

const mapDispatchToProps = { setUser }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNamespaces('common')(UserPopup))
