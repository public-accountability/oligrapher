const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const productionConfig = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin()],
  }
};

module.exports = merge(commonConfig, productionConfig);

