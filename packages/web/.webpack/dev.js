const webpack = require('webpack')
const base = require('./base')

base.mode = 'development'

base.plugins.push(
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    SERVER: process.env.SERVER || 'http://localhost:3000',
  }),
)

base.devtool = 'eval-cheap-module-source-map'

base.devServer = {
  host: '0.0.0.0',
  historyApiFallback: true,
  allowedHosts: 'all',
  port: 3000,
}

module.exports = base
