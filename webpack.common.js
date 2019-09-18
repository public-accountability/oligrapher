const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app/main.jsx'),
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
	exclude: /node_modules/,
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
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
