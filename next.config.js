const webpack = require("webpack");
const NextWorkboxPlugin = require("next-workbox-webpack-plugin");
require("dotenv").config();
const withTM = require("next-transpile-modules");

module.exports = withTM({
  webpack: (config, { isServer, buildId, dev }) => {
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.plugins.push(new webpack.DefinePlugin(env));

    const workboxOptions = {
      runtimeCaching: [
        {
          urlPattern: "/",
          handler: "networkFirst",
          options: {
            cacheName: "html-cache"
          }
        },
        {
          urlPattern: /api/,
          handler: "networkOnly",
          options: {
            cacheName: "internal-api"
          }
        },
        {
          urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
          handler: "cacheFirst",
          options: {
            cacheName: "image-cache",
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: new RegExp("^https://api.themoviedb.org/3/movie"),
          handler: "staleWhileRevalidate",
          options: {
            cacheName: "api-cache",
            cacheableResponse: {
              statuses: [200]
            }
          }
        }
      ]
    };

    config.plugins.push(
      new NextWorkboxPlugin({
        buildId,
        ...workboxOptions
      })
    );

    return config;
  },
  transpileModules: ["moviedb-promise"]
});
