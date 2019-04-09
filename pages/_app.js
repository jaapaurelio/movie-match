import React from "react";
import App, { Container } from "next/app";
import Meta from "../components/meta";
import MainAppContainer from "../components/main-app-container";
import withReduxStore from "../lib/with-redux-store";
import { appWithTranslation } from "../i18n";
import { Provider } from "react-redux";

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["common"] };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <Provider store={reduxStore}>
          <MainAppContainer>
            <Meta />
            <Component {...pageProps} />
          </MainAppContainer>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(appWithTranslation(MyApp));
