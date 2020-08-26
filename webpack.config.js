/*
  Oligrapher's webpack build can be configured via the command line via changes these variables:

  env.output_path         |  asset output directory. defaults to ./dist
  env.public_path         |  code chunks will be fetched from this path. defaults to "http://localhost:8090"
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

function getChunkFilename(env) {
  return getFilename(env).slice(0, -3) + '-[name].js'
}

function getDevServerConfig(env) {
  if (env.dev_server) {
    return {
      contentBase: path.resolve(__dirname, 'html'),
      publicPath: 'http://localhost:8090/',
      port: 8090,
      serveIndex: true,
      historyApiFallback: true,
      hot: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      watchOptions: {
        ignored: [/node_modules/]
      }
    }
  } else {
    return undefined
  }
}

function getPublicPath(env) {
  return env.public_path ? env.public_path : 'http://localhost:8090/'
}

module.exports = function(env) {
  if (!env) {
    throw new Error("Webpack env configuration is missing")
  }

  const production = Boolean(env.production)
  const development = env.development || env.dev_server
  const sourcemap = Boolean(env.sourcemap)

  return {
    mode: production ? 'production' : 'development',
    entry: path.resolve(__dirname, 'app/Oligrapher.jsx'),
    output: {
      path: getOutputPath(env),
      publicPath: getPublicPath(env),
      library: 'Oligrapher',
      libraryTarget: 'umd',
      libraryExport: "default",
      filename: getFilename(env),
      chunkFilename: getChunkFilename(env)
    },

    optimization: {
      minimize: production
    },

    devServer: getDevServerConfig(env),

    devtool: development ? 'eval-source-map' : (sourcemap ? 'inline-source-map' : 'false'),

    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader"
            }
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules\/(?!(@public-accountability.*?\\.js$))/,
          use: [
            { loader: 'babel-loader' }
          ]
        },
        {
          test: /\.(woff2?|ttf|eot|otf|svg)$/,
          use: [
            {
              loader: 'url-loader'
            }
          ]
        },
        {
          test: /\.s?css$/,
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
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'API_URL': JSON.stringify(env.api_url ? env.api_url : 'https://littlesis.org'),
        'PRODUCTION': JSON.stringify(env.production)
      }),
      env.dev_server ? new webpack.HotModuleReplacementPlugin() : false
    ].filter(Boolean),

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        'react-dom': env.dev_server ? '@hot-loader/react-dom' : 'react-dom'
      }
    }
  }
}
