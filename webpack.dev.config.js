var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules/');

var deps = [
  'react/dist/react-with-addons.min.js',
  'marty/dist/marty.min.js',
  'immutable/dist/immutable.min.js',
  'jquery/dist/jquery.min.js',
  'lodash/index.js'
];

var config = {
  entry: {
    app: [
    'webpack/hot/dev-server',
      path.resolve(__dirname, 'app/main.jsx'),
      'bootstrap-sass!./bootstrap-sass.config.js'
    ],
    vendors: [
      'react',
      'marty',
      'immutable',
      'jquery',
      'lodash'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
    publicPath: 'http://localhost:8090/build'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.DefinePlugin({ "process.env": JSON.stringify(process.env)})
  ],
  module: {
    loaders: [
      { test: path.resolve(node_modules, deps[0]),
        loader: "expose?React" },
      { test: /\.jsx?$/,
        exclude: [node_modules],
        loaders: ['react-hot', 'babel'] },
      { test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded&includePaths[]=" +
        (path.resolve(__dirname, "./node_modules")) },
      { test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery' },
      { test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file" },
      { test: /\.xml$/,
        loader: 'xml-loader' },
      { test: /\.(jpe?g|png|gif)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']},
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=image/svg+xml" }
    ],
    noParse:[]
  },
  resolve: {
    alias: {
      'react/lib': path.resolve(node_modules, 'react/lib')
    },
    extensions: ['', '.js', '.jsx']
  },
  historyApiFallback: true
};

deps.forEach(function(dep) {
  var depPath = path.resolve(node_modules, dep);
  config.resolve.alias[dep.split(path.sep)[0]] = depPath;
  config.module.noParse.push(depPath);
});

module.exports = config;
