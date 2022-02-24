import { rollup } from 'rollup';
import handlebars from 'rollup-plugin-handlebars';

import content from '../src/json/content.json';

// export default {
rollup({
	entry: 'src/app.js',
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
});
// };
