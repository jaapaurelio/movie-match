import { withNamespaces } from "../i18n";
import Router from "next/router";

const SLIDES = [
  {
    img: "/static/blabla.png",
    description:
      "Tired of wasting time trying to find the best movie to watch with friends?"
  },
  {
    img: "/static/yesyes.png",
    description: "Create a room, invite your friends and give some likes."
  },
  {
    img: "/static/match.png",
    description:
      "Movie Match will find the perfect movie for you based on your likes. Easy!"
  }
];

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.skip = this.skip.bind(this);

    this.state = {
      currentSlide: 0
    };
  }

  next() {
    if (this.state.currentSlide === 2) {
      return Router.push("/start");
    }

    const currentSlide = this.state.currentSlide + 1;
    this.setState({ currentSlide });
  }

  skip() {
    Router.push("/start");
  }

  render() {
    return (
      <section className="tutorial">
        <div className="tutorial-content">
          <div className="slider-container">
            <div className="image-container">
              <img src={SLIDES[this.state.currentSlide].img} />
            </div>
            <div className="description">
              {SLIDES[this.state.currentSlide].description}
            </div>
          </div>
          <div className="button-container">
            <div onClick={this.skip} className="skip-btn">
              Close
            </div>
            <div onClick={this.next} className="skip-btn">
              Next
            </div>
          </div>
        </div>
        <style jsx>
          {`
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
    );
  }

  static getInitialProps() {
    return {
      namespacesRequired: ["common"]
    };
  }
}

export default withNamespaces("common")(Intro);