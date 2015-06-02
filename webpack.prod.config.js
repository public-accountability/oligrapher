var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: [
    path.resolve(__dirname, 'app/main.jsx'),
    'bootstrap-sass!./bootstrap-sass.config.js'
  ],
  output: {
    path: 'build',
    filename: 'app.js'
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env": JSON.stringify(process.env)}),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'build/index-template.html')
    })
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: [node_modules],
        loader: 'babel'
      },
      { test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded&includePaths[]=" +
        node_modules },
      { test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=image/svg+xml" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};


module.exports = config;
