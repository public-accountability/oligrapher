// const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

const localAPIUrl = 'http://localhost:8081'

const devServerConfig = {
  mode: 'development',
  devServer: {
    contentBase: './build',
    publicPath: 'http://localhost:8090/build/',
    port: 8090,
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

const config = merge(common, devServerConfig)

config.plugins.unshift(
  new webpack.DefinePlugin({
    'API_URL': JSON.stringify(localAPIUrl)
  })
)

module.exports = config
