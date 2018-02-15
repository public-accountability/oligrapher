const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const webpack = require('webpack');

var config = {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({ "process.env": { 'NODE_ENV': JSON.stringify('production') } }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
};

module.exports = merge(common, config);

