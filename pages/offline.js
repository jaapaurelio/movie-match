import Topbar from "../components/topbar";
import { withNamespaces } from "../i18n";

class Offline extends React.Component {
  constructor(props) {
    super(props);
    this.reload = this.reload.bind(this);
  }

  reload() {
    location.reload();
  }

  render() {
    return (
      <div>
        <Topbar />
        <div className="offline">
          You're offline.
          <br /> Please connect to the internet and try again.
        </div>
        <div className="try-button">
          <button onClick={this.reload} className="mm-btn">
            Try again
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
    );
  }

  static getInitialProps() {
    return {
      namespacesRequired: ["common"]
    };
  }
}

export default withNamespaces("common")(Offline);
