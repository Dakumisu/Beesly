const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const ip = require('internal-ip')
const portFinderSync = require('portfinder-sync')
const { HotModuleReplacementPlugin } = require('webpack')

const infoColor = (_message) => {
	return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
	commonConfiguration, {
		mode: 'development',

		plugins: [
			new HotModuleReplacementPlugin()
		],

		devServer: {
			host: '0.0.0.0',
			port: portFinderSync.getPort(8080),
			contentBase: './',
			watchContentBase: true,
			open: true,
			https: false,
			useLocalIp: true,
			disableHostCheck: true,
			overlay: true,
			noInfo: true,
			hot: false,
			allowedHosts: ['all'],

			after: function (app, server, compiler) {
				const port = server.options.port
				const https = server.options.https ? 's' : ''
				const localIp = ip.v4.sync()
				const domain1 = `http${https}://${localIp}:${port}`
				const domain2 = `http${https}://localhost:${port}`

				console.log(`✨ Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
			}
		},
		stats: {
			assets: false,
			builtAt: true,
			children: false,
			chunks: false,
			chunkGroups: false,
			chunkModules: false,
			chunkOrigins: false,
			colors: {
				green: '\u001b[32m',
			},
			depth: false,
			entrypoints: false,
			env: false,
			hash: false,
			outputPath: false,
			publicPath: false,
			timings: false,
			source: false,
			reasons: false,
			modules: false,
			providedExports: false,
			logging: 'info',
			loggingTrace: false,
			version: false,
		},
		module: {
			rules: [{
				test: /\.(styl|css)$/,
				use: [
					'style-loader',
					'css-loader',
					'stylus-loader'
				]
			}]
		}
	})
