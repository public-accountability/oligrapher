const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

var config = {
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
};

module.exports = merge(common, config);
