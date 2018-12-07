import React from "react";
import App, { Container } from "next/app";
import Meta from "../components/meta";
import MainAppContainer from "../components/main-app-container";

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <MainAppContainer>
          <Meta />
          <Component {...pageProps} />
        </MainAppContainer>
      </Container>
    );
  }
}
