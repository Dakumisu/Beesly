import { defineConfig, loadEnv } from 'vite';
import glslify from 'vite-plugin-glslify';
import handlebars from 'vite-plugin-handlebars';
import ifdefRollupPlugin from './ifdef/ifdefRollupPlugin';

import content from '../src/json/content.json';

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	if (!process.env.NODE_ENV) process.env.NODE_ENV = mode;

	console.log('🏓 Environnement :', process.env.NODE_ENV);

	const debug = process.env.NODE_ENV
		? process.env.NODE_ENV != 'production'
		: true;
	const define = {
		DEBUG: debug,
	};

	return defineConfig({
		server: {
			port: '8080',
			https: false,
			open: false,
			host: true,
			hmr: { port: 8080 },
		},

		json: {
			stringify: true,
		},

		plugins: [
			glslify(),
			ifdefRollupPlugin(define),
			handlebars({
				reloadOnPartialChange: false,
				context: content,
			}),
		],

		transforms: [
			{
				test: ({ path }) => path.endsWith('.html'),
				transform({ code }) {
					return `export default ${JSON.stringify(code)}`;
				},
			},
		],

		assetsInclude: ['**/*.glb', '**/*.gltf'],

		resolve: {
			alias: [
				{
					find: '@js',
					replacement: '/src/js',
				},
				{
					find: '@json',
					replacement: '/src/json',
				},
				{
					find: '@scss',
					replacement: '/src/scss',
				},
				{
					find: '@utils',
					replacement: '/src/utils',
				},
				{
					find: '@workers',
					replacement: '/src/workers',
				},
				{
					find: '@src',
					replacement: '/src',
				},
				{
					find: '@@',
					replacement: '/*',
				},
			],
			extensions: ['.cjs', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
		},

		preprocessorOptions: {
			scss: {
				sassOptions: {
					outputStyle: 'compressed',
				},
			},
		},
	});
};
