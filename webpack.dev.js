const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'oligrapher-dev.js'
  },
  optimization: {
    minimize: false
  }
};

module.exports = merge(commonConfig, devConfig);
