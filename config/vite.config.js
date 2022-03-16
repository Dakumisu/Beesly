import { defineConfig, loadEnv } from 'vite';
import glslify from 'vite-plugin-glslify';
import handlebars from 'vite-plugin-handlebars';
import ifdefRollupPlugin from './ifdef/ifdefRollupPlugin';

import content from '../src/json/content.json';

export default ({ mode }) => {
	console.log('🏓 Environnement :', mode);

	const debug = mode ? mode != 'production' : true;
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

		plugins: [
			glslify(),
			ifdefRollupPlugin(define),
			handlebars({
				reloadOnPartialChange: false,
				context: content,
			}),
		],

		assetsInclude: ['**/*.glb', '**/*.gltf'],

		resolve: {
			alias: [
				{
					find: '@webgl',
					replacement: '/src/js/Webgl',
				},
				{
					find: '@dom',
					replacement: '/src/js/Dom',
				},
				{
					find: '@tools',
					replacement: '/src/js/Tools',
				},

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
