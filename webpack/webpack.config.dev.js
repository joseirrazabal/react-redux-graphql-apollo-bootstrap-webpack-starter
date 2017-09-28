const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootFolder = path.resolve(__dirname, '..')

const extractCSS = new ExtractTextPlugin('[name].[contenthash].fonts.css');
const extractSCSS = new ExtractTextPlugin('[name].[contenthash].styles.css');

// var Dashboard = require('webpack-dashboard')
// var DashboardPlugin = require('webpack-dashboard/plugin')
// var dashboard = new Dashboard()

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      './src/app/index.js',
    ],
    vendor: [
      'apollo-client',
      'babel-polyfill',
      'classnames',
      'graphql-tag',
      'moment',
      'react',
      'react-apollo',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'history',
      'react-router',
      'react-router-redux',
      'react-tap-event-plugin',
      'redux',
      'redux-thunk'
    ]
  },

  output: {
    path: path.join(rootFolder, '/build'),
    filename: 'scripts/[name].[chunkhash].js',
    chunkFilename: 'scripts/[name].[chunkhash].chunk.js',
    publicPath: '/',
  },

  resolveLoader: {
    modules: [path.join(rootFolder, 'node_modules')],
    moduleExtensions: ['-loader'],
  },

  resolve: {
    modules: [path.resolve(rootFolder, 'client'), path.resolve(rootFolder, 'src'), 'node_modules'],
    descriptionFiles: ['package.json'],
    moduleExtensions: ['-loader'],
    extensions: ['.js', '.jsx', '.scss', '.css']
  },

  module: {
    rules: [
      // {
      //   enforce: "pre",
      //   test: /\.jsx$/,
      // test: /\.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      // },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: [/node_modules/]
      },
      {
        //   test: /\.(css|scss)$/,
        test: /\.(scss)$/,
        use: ['css-hot-loader'].concat(extractSCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoader: 1,
                // localIdentName: '[hash:base64:5]',
                localIdentName: '[local]',
                modules: true,
                camelCase: true,
                alias: {'../img': '../public/img'},
              }
            },
            'resolve-url-loader',
            'sass-loader?sourceMap'
          ]
        }))
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        use: [
          {
            // loader: 'url-loader'
            loader: 'file-loader',
            options: {
              name: './img/[name].[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: './fonts/[name].[hash].[ext]'
        }
      }
    ],
  },

  plugins: [
    // new webpack.DefinePlugin({'process.env': {NODE_ENV: '"development"'}}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    extractCSS,
    extractSCSS,
    new HtmlWebpackPlugin({
      inject: true,
      // template: './client/200.ejs',
      template: './public/index.html',
      title: 'Titulo',
      minify: {
        collapseBooleanAttributes: true,
        removeComments: true,
        collapseWhitespace: true,
      }
    }),
    new CopyWebpackPlugin([
      {from: './public/img', to: 'img'}
    ],
      {copyUnmodified: false}
    ),
    // new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
    new webpack.optimize.CommonsChunkPlugin({
      name:     'vendor',
      filename: 'app.vendor.bundle.js'
    })
    // new DashboardPlugin(dashboard.setData),
  ],

  // devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
  // devtool: 'eval',
  devtool: '#source-map',
  watch: true,
  devServer: {
    contentBase: path.join(rootFolder, '/build'),
    historyApiFallback: true,
    port: 3000,
    compress: true,
    inline: true,
    hot: true,
    open: false, // abre navegador
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      }
    },
  },

  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
