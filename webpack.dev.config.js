var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules/');

var config = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      path.resolve(__dirname, 'app/main.jsx'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'oligrapher.min.js',
    publicPath: 'http://localhost:8090/build',
    library: 'Oligrapher',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.DefinePlugin({ "process.env": JSON.stringify(process.env)})
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: [node_modules],
        loaders: ['react-hot', 'babel'] },
      { test: /\.css$/, 
        loader: "style-loader!css-loader" },
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=30000' }
    ],
    noParse:[]
  },
  resolve: {
    alias: {
      'react/lib': path.resolve(node_modules, 'react/lib')
    },
    extensions: ['', '.js', '.jsx']
  }
};

module.exports = config;
