import Head from "next/head";
export default () => (
  <div>
    <Head>
      <link rel="manifest" href="/static/manifest.json" />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:400,700"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Pacifico"
        rel="stylesheet"
      />

      <link
        href="https://fonts.googleapis.com/css?family=Thasadith:400,700"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Oswald"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
        integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Quicksand:500|Raleway"
        rel="stylesheet"
      />
      <meta name="theme-color" content="#333" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1.0, user-scalable=no"
      />
      <meta charSet="utf-8" />
    </Head>
    <style jsx global>{`
      html,
      body,
      div,
      span,
      applet,
      object,
      iframe,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      blockquote,
      pre,
      a,
      abbr,
      acronym,
      address,
      big,
      cite,
      code,
      del,
      dfn,
      em,
      img,
      ins,
      kbd,
      q,
      s,
      samp,
      small,
      strike,
      strong,
      sub,
      sup,
      tt,
      var,
      b,
      u,
      i,
      center,
      dl,
      dt,
      dd,
      ol,
      ul,
      li,
      fieldset,
      form,
      label,
      legend,
      table,
      caption,
      tbody,
      tfoot,
      thead,
      tr,
      th,
      td,
      article,
      aside,
      canvas,
      details,
      embed,
      figure,
      figcaption,
      footer,
      header,
      hgroup,
      menu,
      nav,
      output,
      ruby,
      section,
      summary,
      time,
      mark,
      audio,
      video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
      }
      /* HTML5 display-role reset for older browsers */
      article,
      aside,
      details,
      figcaption,
      figure,
      footer,
      header,
      hgroup,
      menu,
      nav,
      section {
        display: block;
      }
      body {
        line-height: 1;
      }
      ol,
      ul {
        list-style: none;
      }
      blockquote,
      q {
        quotes: none;
      }
      blockquote:before,
      blockquote:after,
      q:before,
      q:after {
        content: "";
        content: none;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }

      body {
        font-family: "Raleway", sans-serif;
        color: #333;
        line-height: 1.4;
        background: #fdfdfd;
      }

      .mm-big-message {
        text-align: center;
        padding: 20px;
        font-size: 16px;
        color: #0f3846;
      }

      select {
        background: #fff;
        border: 1px solid #b7b7b7;
        border-radius: 3px;
        padding: 3px 22px 3px 3px;
        background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7.406 7.828l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z'%3E%3C/path%3E%3C/svg%3E");
        background-position: calc(100% - 3px) 50%;
        background-repeat: no-repeat;
        background-size: 16px;
        -webkit-appearance: none;
        -moz-appearance: none;
      }

      select::-ms-expand {
        display: none;
      }

      .mm-content-padding {
        padding: 0px 20px;
      }

      .mm-all-padding {
        padding: 20px;
      }

      .join-title {
        text-align: center;
        font-weight: bold;
        margin: 40px 0 10px;
        font-size: 16px;
      }

      .room-input {
        padding: 10px;
        font-size: 16px;
        text-align: center;
        border: 1px solid #b7b7b7;
        width: 170px;
        box-sizing: border-box;
      }

      .join-btn {
        margin-top: 10px;
      }

      .mm-btn {
        display: inline-block;
        padding: 10px;
        border: 1px solid #ffc818;
        border-radius: 6px;
        text-decoration: none;
        color: #333;
        font-size: 14px;
        cursor: pointer;
        background: #ffc818;
        width: 170px;
        box-sizing: border-box;
        line-height: 1;
      }

      .options-container {
        padding: 0 20px;
        text-align: center;
      }

      strong {
        font-weight: bold;
      }
    `}</style>
  </div>
);
