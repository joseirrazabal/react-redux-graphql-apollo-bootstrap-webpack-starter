var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

const rootFolder = path.resolve(__dirname, '..')

module.exports = {
	context: rootFolder,

	output: {
		path: path.join(rootFolder, '/dist'),
		filename: 'scripts/[name].[chunkhash].js',
		chunkFilename: 'scripts/[name].[chunkhash].chunk.js',
	},

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
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							localIdentName: '[local]',
							modules: true
						}
					},
					'sass-loader'
				]
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
		new webpack.DefinePlugin({'process.env': {NODE_ENV: '"development"'}}),
		new webpack.NamedModulesPlugin(),
	],

	node: {
		fs: 'empty',
		vm: 'empty',
		net: 'empty',
		tls: 'empty'
	}
}
