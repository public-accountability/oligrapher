const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const productionConfig = {
  mode: 'production',
  optimization: {
    minimize: true
  }
};

module.exports = merge(commonConfig, productionConfig);

