var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');

var config = {
  entry: [
    path.resolve(__dirname, 'app/main.jsx'),
  ],
  output: {
    path: 'build',
    filename: '/oligrapher.min.js'
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env": { 'NODE_ENV': JSON.stringify('production') } })
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: [node_modules],
        loader: 'babel' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};


module.exports = config;
