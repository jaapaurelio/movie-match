import PageWidth from "./page-width";
import Link from "next/link";

export default ({ children, title = "Movie Match" }) => (
  <nav>
    <PageWidth>
      <div className="container">
        <Link href={`/start`}>
          <img className="logo" src="/static/Icon.png" />
        </Link>

        <Link href={`/start`}>
          <div className="page-title">{title}</div>
        </Link>
        <div className="space-between" />
        <div className="top-icons-container">{children}</div>
      </div>
    </PageWidth>

    <style jsx>
      {`
        nav {
          background: #333;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .logo {
          width: 20px;
          margin-right: 10px;
        }

        .space-between {
          flex-grow: 1;
        }

        .container {
          display: flex;
          height: 45px;
          padding: 0px 20px;
          align-items: center;
          color: #ffffff;
          position: relative;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          box-sizing: border-box;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .top-icons-container {
          display: flex;
        }

        .top-icon {
          margin-left: 10px;
          padding: 10px;
        }

        .active-tab {
          border-bottom: 2px solid;
        }

        .matched {
          color: #ccffbc;
        }
      `}
    </style>
  </nav>
);
