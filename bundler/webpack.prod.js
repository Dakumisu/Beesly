const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')

module.exports = merge(
	commonConfiguration, {
		mode: 'production',

		plugins: [
			new CleanWebpackPlugin(),
		]
	}
)
