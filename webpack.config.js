/*
  Oligrapher's webpack build can be configured via the command line via changes these variables:

  env.output_path            |  asset output directory. defaults to ./dist
  env.filename            |  defaults to "oligrapher.js" or "oligrapher-dev.js"
  env.production          |  enables production mode
  env.development         |  enables development mode
  env.dev_server          |  enables dev server mode
  env.api_url             |  littlesis datasource url. defaults to "https://littlesis.org"

  Also see the yarn scripts in package.json
*/

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

function getOutputPath(env) {
  if (env.output_path) {
    let output_path = path.resolve(env.output_path)

    if (fs.existsSync(output_path) && fs.lstatSync(output_path).isDirectory()) {
      return output_path
    } else {
      throw new Error(`Invalid output path: ${output_path}`)
    }
  } else {
    return path.resolve(__dirname, 'dist')
  }
}

function getFilename(env) {
  if (env.filename) {
    if (env.filename.slice(-3) === '.js') {
      return env.filename
    } else {
      throw new Error(`Invalid filename: ${env.filename}`)
    }
  }

  if (env.production) {
    return "oligrapher.js"
  } else {
    return "oligrapher-dev.js"
  }
}

function getDevServerConfig(env) {
  if (env.dev_server) {
    return {
      contentBase: path.resolve(__dirname, 'html'),
      publicPath: '/assets/',
      port: 8090,
      serveIndex: true,
      historyApiFallback: true,
      hot: true
    }
  } else {
    return undefined
  }
}

module.exports = function(env) {
  if (!env) {
    throw new Error("Webpack env configuration is missing")
  }

  const production = Boolean(env.production)
  const development = env.development || env.dev_server

  return {
    mode: production ? 'production' : 'development',
    entry: path.resolve(__dirname, 'app/Oligrapher.jsx'),
    output: {
      path: getOutputPath(env),
      library: 'Oligrapher',
      libraryTarget: 'umd',
      libraryExport: "default",
      filename: getFilename(env)
    },

    optimization: {
      minimize: production
    },

    devServer: getDevServerConfig(env),

    devtool: development ? 'inline-source-map' : 'false',

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
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass')
              }
            }
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
        'API_URL': JSON.stringify(env.api_url ? env.api_url : 'https://littlesis.org')
      }),
      env.dev_server ? new webpack.HotModuleReplacementPlugin() : false
    ].filter(Boolean),

    resolve: {
      extensions: ['.js', '.jsx']
    }
  }
}
