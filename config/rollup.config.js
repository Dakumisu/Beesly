import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'src/app.js',
	output: {
		file: 'index.js',
		format: 'cjs',
	},
	plugins: [nodeResolve()],
};
