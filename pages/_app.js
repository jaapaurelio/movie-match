import React from "react";
import App, { Container } from "next/app";
import Meta from "../components/meta";
import MainAppContainer from "../components/main-app-container";
import { appWithTranslation } from "../i18n";

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["common"] };
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

export default appWithTranslation(MyApp);
