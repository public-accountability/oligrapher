const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app/main.jsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    library: 'Oligrapher',
    libraryTarget: 'umd',
    filename: 'oligrapher.js'
  },
  module: {
    rules: [
      {
	test: /\.jsx?$/,
	exclude: /node_modules/,
	use: [ 'babel-loader' ]
      },
      {
	test: /\.css$/,
	use: [
	  {
	    loader: 'style-loader'
	  },
	  {
	    loader: 'css-loader',
	    options: {
	      minimize: true
	    }
	  }
	]
      },
      {
	test: /\.(woff2?|ttf|eot|svg)$/,
	use:  [{
	  loader: 'url-loader',
	  options: { limit: 30000 }
	}]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
