var handlebars = require('rollup-plugin-handlebars-plus');

import content from '../src/json/content.json';

export default {
	input: 'src/app.js',
	output: {
		file: 'app.js',
		format: 'cjs',
	},
	plugins: [
		handlebars({
			reloadOnPartialChange: false,
			context: content,
		}),
	],
	treeshake: {
		moduleSideEffects: false,
		tryCatchDeoptimization: true,
		propertyReadSideEffects: true,
		unknownGlobalSideEffects: true,
	},
};
