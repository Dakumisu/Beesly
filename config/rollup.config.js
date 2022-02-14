import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'src/app.js',
	output: {
		file: 'app.js',
		format: 'cjs',
	},
	plugins: [nodeResolve()],
};
