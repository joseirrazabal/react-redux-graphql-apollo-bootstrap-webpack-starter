var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

const rootFolder = path.resolve(__dirname, '..')

var nodeModules = {}
fs.readdirSync('node_modules')
	.filter(function(x) {
		return ['.bin'].indexOf(x) === -1
	})
	.forEach(function(mod) {
		nodeModules[mod] = 'commonjs ' + mod
	})

module.exports = {
	context: rootFolder,

	entry: {
		index: './src',
		app: './client/client.js', // para incluir el css
	},

	output: {
		path: path.join(rootFolder, 'lib'),
		filename: '[name].js',
		library: ["[name]"],
		libraryTarget: 'umd'
	},

	externals: nodeModules,
	// external: [
	//   'react',
	//   'react-dom'
	// ],

	resolveLoader: {
		modules: [path.join(rootFolder, 'node_modules')],
		moduleExtensions: ['-loader'],
	},

	resolve: {
		modules: [path.resolve(rootFolder, 'src'), 'node_modules'],
		descriptionFiles: ['package.json'],
		moduleExtensions: ['-loader'],
		extensions: ['.js', '.jsx', '.scss', '.css']
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: "babel-loader",
				exclude: [/node_modules/]
			},
			{
				test: /\.(css|scss)$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								// localIdentName: '[hash:base64:5]',
								modules: false
							}
						},
						'sass-loader'
					]
				})
			},
			{
				test: /\.png$/,
				loader: "url-loader?limit=100000"
			},
			{
				test: /\.jpg$/,
				loader: "file-loader"
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=image/svg+xml'
			}
		],
	},

	plugins: [
		new ExtractTextPlugin("css/index.css"),
		// new ExtractTextPlugin("[name].[contenthash].css"),
		new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
		// new webpack.optimize.AggressiveSplittingPlugin({
		//             minSize: 30000,
		//             maxSize: 50000
		// }),
		// new HtmlWebpackPlugin({
		//	inject: false,
		//	template: './client/200.ejs',
		//	title: 'Titulo',
		//	minify: {
		//		collapseBooleanAttributes: true,
		//		removeComments: true,
		//		collapseWhitespace: true,
		//	}
		// }),
		new webpack.optimize.CommonsChunkPlugin({names: ['index'], filename: 'index.js'}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				warnings: false
			},
			output: {
				comments: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
	],

	// Include mocks for when node.js specific modules may be required
	node: {
		fs: 'empty',
		vm: 'empty',
		net: 'empty',
		tls: 'empty'
	}
}
