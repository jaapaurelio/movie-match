import React from "react";

export default class extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.writeHead(302, {
        Location: "/start"
      });
      res.end();
    }
    return {};
  }
}
