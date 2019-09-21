import React from 'react'
import App from 'next/app'
import Meta from '../components/meta'
import MainAppContainer from '../components/main-app-container'
import withReduxStore from '../lib/with-redux-store'
import { appWithTranslation } from '../i18n'
import { Provider } from 'react-redux'
import * as gtag from '../lib/gtag'
import Router from 'next/router'

Router.events.on('routeChangeComplete', url => gtag.pageview(url))

class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps, namespacesRequired: ['common'] }
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props

        return (
            <Provider store={reduxStore}>
                <MainAppContainer>
                    <Meta />
                    <Component {...pageProps} />
                </MainAppContainer>
            </Provider>
        )
    }
}

export default withReduxStore(appWithTranslation(MyApp))
