const webpack = require('webpack')
const withOffline = require('next-offline')
require('dotenv').config()
const withTM = require('next-transpile-modules')
const { i18n } = require('./next-i18next.config')

module.exports = {
    i18n,
    async redirects() {
        return [
            {
                source: '/start',
                destination: '/',
                permanent: true,
            },
        ]
    },
    ...withOffline({
        workboxOpts: {
            swDest: process.env.NEXT_EXPORT
                ? 'service-worker.js'
                : 'static/service-worker.js',
            runtimeCaching: [
                {
                    urlPattern: '/',
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'html-cache',
                    },
                },
                {
                    urlPattern: /api/,
                    handler: 'NetworkOnly',
                    options: {
                        cacheName: 'internal-api',
                    },
                },
                {
                    urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'image-cache',
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
                {
                    urlPattern: new RegExp(
                        '^https://api.themoviedb.org/3/movie'
                    ),
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'api-cache',
                        cacheableResponse: {
                            statuses: [200],
                        },
                    },
                },
            ],
        },
        async rewrites() {
            return [
                {
                    source: '/service-worker.js',
                    destination: '/_next/static/service-worker.js',
                },
            ]
        },
    }),
    ...withTM({
        webpack: (config, { isServer, buildId, dev }) => {
            const env = Object.keys(process.env).reduce((acc, curr) => {
                acc[`process.env.${curr}`] = JSON.stringify(process.env[curr])
                return acc
            }, {})

            config.plugins.push(new webpack.DefinePlugin(env))

            return config
        },
        generateInDevMode: true,
        transpileModules: ['moviedb-promise'],
    }),
}
