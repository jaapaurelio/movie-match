import React from "react";
import Topbar from "../components/topbar";
import Link from "next/link";

class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode, namespacesRequired: ["common"] };
  }

  render() {
    return (
      <div>
        <Topbar />
        <div className="error">Sorry, page not found</div>
        <div className="home-link">
          <div className="mm-btn">
            <Link href={`/start`}>Go to Home </Link>
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
    );
  }
}

export default ErrorPage;