import { withNamespaces } from '../i18n'
import Router from 'next/router'
import jsCookie from 'js-cookie'

class Intro extends React.Component {
    constructor(props) {
        super(props)
        this.next = this.next.bind(this)
        this.skip = this.skip.bind(this)

        this.state = {
            currentSlide: 0,
            slides: [
                {
                    img: '/static/blabla.png',
                    description: this.props.t('intro-1'),
                },
                {
                    img: '/static/yesyes.png',
                    description: this.props.t('intro-2'),
                },
                {
                    img: '/static/match.png',
                    description: this.props.t('intro-3'),
                },
            ],
        }
    }

    next() {
        if (this.state.currentSlide === 2) {
            return Router.push('/start')
        }

        const currentSlide = this.state.currentSlide + 1
        this.setState({ currentSlide })
    }

    skip() {
        Router.push('/start')
    }

    componentDidMount() {
        jsCookie.set('intro-visited', true)
    }

    render() {
        return (
            <section className="tutorial">
                <div className="tutorial-content">
                    <div className="slider-container">
                        <div className="image-container">
                            <img
                                src={
                                    this.state.slides[this.state.currentSlide]
                                        .img
                                }
                            />
                        </div>
                        <div className="description">
                            {
                                this.state.slides[this.state.currentSlide]
                                    .description
                            }
                        </div>
                        <div className="dots-container">
                            {this.state.slides.map((slide, index) => (
                                <span
                                    className={
                                        index === this.state.currentSlide
                                            ? 'dot dot-selected'
                                            : 'dot'
                                    }
                                >
                                    {' '}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="button-container">
                        <div onClick={this.skip} className="skip-btn">
                            {this.props.t('close-btn')}
                        </div>
                        <div onClick={this.next} className="skip-btn">
                            {this.props.t('intro-next-btn')}
                        </div>
                    </div>
                </div>
                <style jsx>
                    {`
                        .dots-container {
                            text-align: center;
                        }

                        .dot {
                            background: #d1e1ee;
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            margin: 6px;
                            border-radius: 50%;
                        }

                        .dot-selected {
                            background: #3c8bce;
                        }

                        .image-container {
                            text-align: center;
                        }

                        .image-container img {
                            width: 100%;
                            max-width: 300px;
                        }

                        .description {
                            margin-top: 40px;
                            text-align: center;
                            font-size: 20px;
                            margin-bottom: 40px;
                        }

                        .tutorial {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            z-index: 2;
                            background: #ffffff;
                            padding: 40px;
                            box-sizing: border-box;
                        }

                        .tutorial-content {
                            display: flex;
                            height: 100%;
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            align-items: flex-start;
                            justify-content: center;
                            flex-direction: column;
                        }

                        .slider-container {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            width: 100%;
                        }

                        .button-container {
                            width: 100%;
                            text-align: center;
                            display: flex;
                            justify-content: space-between;
                            color: gray;
                            text-transform: uppercase;
                        }
                    `}
                </style>
            </section>
        )
    }

    static getInitialProps() {
        return {
            namespacesRequired: ['common'],
        }
    }
}

export default withNamespaces('common')(Intro)
