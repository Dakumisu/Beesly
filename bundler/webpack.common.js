const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const { DefinePlugin, EnvironmentPlugin } = require('webpack')

const debug = process.env.NODE_ENV == 'development' ? true : false // Provisoire

const opts = {
	DEBUG: debug,
	version: 3,
	"ifdef-verbose": true,
	"ifdef-triple-slash": true,
	"ifdef-fill-with-blanks": true,
	"ifdef-uncomment-prefix": "// #code "
}

module.exports = {
	entry: {
		app: path.resolve(__dirname, '../src/app.js'),
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, '../dist')
	},
	resolve: {
		alias: {
			'@js': path.resolve(__dirname, '../src/js/'),
			'@glsl': path.resolve(__dirname, '../src/glsl/'),
			'@utils': path.resolve(__dirname, '../src/utils/'),
			'@workers': path.resolve(__dirname, '../src/workers/'),
			'@src': path.resolve(__dirname, '../src/'),

			'@static': path.resolve(__dirname, '../static/'),
			'@public': path.resolve(__dirname, '../public/'),
			'@@': path.resolve(__dirname, '../*'),
		}
	},
	devtool: 'source-map',
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{ from: path.resolve(__dirname, '../static'), to: path.resolve(__dirname, '../dist/assets') }
			]
		}),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: 'WebGL Starter',
			favicon: path.resolve(__dirname, '../static/icon/favicon.jpg'),
			template: path.resolve(__dirname, '../src/index.html'),
			chunks: ['app'],
			minify: true
		}),

		new MiniCSSExtractPlugin({
			filename: 'style.css'
		}),
	],
	module: {
		rules: [
			// HTML
			{
				test: /\.html$/,
				use: ['html-loader']
			},

			// JS
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
					{ loader: "ifdef-loader", options: opts },
				]
			},

			// CSS
			{
				test: /\.css$/,
				use: [
					MiniCSSExtractPlugin.loader,
					'css-loader'
				]
			},

			// SCSS
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCSSExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			},

			// Images
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'assets/images/'
					}
				}]
			},

			// Fonts
			{
				test: /\.(otf|ttf|eot|woff|woff2)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'assets/fonts/'
					}
				}]
			},

			// Sounds/Music
			{
				test: /\.(mp3|wav)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'assets/sound/'
					}
				}]
			},

			// Videos
			{
				test: /\.(mp4|webm)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'assets/videos/'
					}
				}, ]
			},

			// Models
			{
				test: /\.(fbx|glb|obj|3ds|gltf|bin)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'assets/models/'
					}
				}]
			},

			// Shaders
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				use: [
					'raw-loader',
					'glslify-loader'
				]
			},

			// Markdown
			{
				test: /\.(md)$/,
				exclude: /node_modules/,
				use: [
					'file-loader'
				]
			},
		]
	}
}
