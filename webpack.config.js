/*
  Oligrapher's webpack build can be configured via the command line via changes these variables:

  env.output_path         |  asset output directory. defaults to ./dist
  env.public_path         |  code chunks will be fetched from this path. defaults to "http://localhost:8091"
  env.production          |  enables production mode
  env.dev_server          |  enables dev server mode
  env.api_url             |  littlesis datasource url. defaults to "https://littlesis.org"
  env.onefile             |  outputs a single compiled file

  Also see the yarn scripts in package.json
*/
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')

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

function getDevServerConfig(env) {
  if (env.dev_server) {
    return {
      port: 8090,
      historyApiFallback: true,
      hot: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      static: {
        directory: path.join(__dirname, 'html'),
        serveIndex: true
      }
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
  const development = !production
  const devServer = env.dev_server
  const onefile = Boolean(env.onefile)
  const maxChunks = onefile ? 1 : 10
  const fileBaseName = env.production ? 'oligrapher' : 'oligrapher-dev'
  const fileName = fileBaseName + (onefile ? "-[git-revision-hash]" : "") + ".js"
  const chunkFileName = fileBaseName + "-[id]-[contenthash].js"
  const publicPath = "/oligrapher/assets/"
  const apiUrl = env.api_url ? env.api_url : (production ? 'https://littlesis.org' : 'http://localhost:8081')
  const outputPath = getOutputPath(env)
  const devTool = devServer ? 'eval-source-map' : (onefile ? 'source-map' : false)

  return {
    mode: production ? 'production' : 'development',
    entry: path.resolve(__dirname, 'app/Oligrapher.jsx'),
    output: {
      path: outputPath,
      publicPath: publicPath,
      library: {
        name: 'Oligrapher',
        type: 'umd',
        export: 'default'
      },
      filename: fileName,
      chunkFilename: chunkFileName
    },
    optimization: {
      minimize: production,
      chunkIds: 'deterministic'
    },

    devServer: getDevServerConfig(env),
    devtool: devTool,

    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
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
      new GitRevisionPlugin(),
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: maxChunks }),
      new webpack.DefinePlugin({
        'API_URL': JSON.stringify(apiUrl),
        'PRODUCTION': JSON.stringify(production)
      }),
      devServer ? new webpack.HotModuleReplacementPlugin() : false
    ].filter(Boolean),

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        'react-dom': devServer ? '@hot-loader/react-dom' : 'react-dom'
      }
    }
  }
}
