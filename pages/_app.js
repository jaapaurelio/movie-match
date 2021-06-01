import React from 'react'
import App from 'next/app'
import Meta from '../components/meta'
import { appWithTranslation } from 'next-i18next'
import * as gtag from '../lib/gtag'
import Router from 'next/router'

import '../assets/reset.css'
import '../assets/app.css'

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />

export default appWithTranslation(MyApp)
