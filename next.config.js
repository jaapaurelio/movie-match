const webpack = require('webpack')
const withOffline = require('next-offline')
require('dotenv').config()
const withTM = require('next-transpile-modules')

module.exports = withOffline(
    withTM({
        webpack: (config, { isServer, buildId, dev }) => {
            const env = Object.keys(process.env).reduce((acc, curr) => {
                acc[`process.env.${curr}`] = JSON.stringify(process.env[curr])
                return acc
            }, {})

            config.plugins.push(new webpack.DefinePlugin(env))

            return config
        },
        generateInDevMode: true,
        workboxOpts: {
            swDest: process.env.NEXT_EXPORT
                ? 'service-worker.js'
                : 'static/service-worker.js',
            runtimeCaching: [
                {
                    urlPattern: /^https?.*/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'offlineCache',
                        expiration: {
                            maxEntries: 200,
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
        transpileModules: ['moviedb-promise'],
    })
)
