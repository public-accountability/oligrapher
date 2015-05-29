var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './app/main.jsx',
    'bootstrap-sass!./bootstrap-sass.config.js'
  ],
  output: {
    //path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8090/build'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel' },
      { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded&includePaths[]=" +
        (path.resolve(__dirname, "./node_modules")) },
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" },
      { test: /\/marty\//, loader: "babel" }
    ]
  },
  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};
