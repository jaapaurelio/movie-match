import Head from "next/head";
import ResetCss from "./reset-css";
import AppCss from "./app-css";

export default () => (
  <div>
    <Head>
      <link rel="manifest" href="/static/manifest.json" />
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
        integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Quicksand|Raleway:400,700|Pacifico"
        rel="stylesheet"
      />
      <meta name="theme-color" content="#333" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1.0, user-scalable=no"
      />
      <meta charSet="utf-8" />
    </Head>
    <ResetCss />
    <AppCss />
  </div>
);
