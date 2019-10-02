const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'app/Oligrapher.jsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    library: 'Oligrapher',
    libraryTarget: 'umd',
    libraryExport: "default",
    filename: 'oligrapher.js'
  },
  module: {
    rules: [
      {
	test: /\.jsx?$/,
	exclude: /node_modules\/(?!(@public-accountability.*?\\.js$))/,
	use: [
	  { loader: 'babel-loader' }
	]
      },
      {
	test: /\.css$/,
	use: [
	  { loader: 'style-loader' },
	  { loader: 'css-loader' }
	]
      },
      {
	test: /\.(woff2?|ttf|eot|svg)$/,
	use:  [
	  {
	    loader: 'url-loader',
	    options: { limit: 30000 }
	  }
	]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'API_URL': JSON.stringify('https://littlesis.org')
    })
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  }
};
