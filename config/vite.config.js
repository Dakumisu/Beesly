import { defineConfig, loadEnv } from 'vite';
import glsl from 'vite-plugin-glsl';
import ifdefRollupPlugin from './ifdef/ifdefRollupPlugin';

import rollupConfig from './rollup.config';

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
		},

		plugins: [glsl(), ifdefRollupPlugin(define)],

		assetsInclude: ['**/*.glb', '**/*.gltf'],

		resolve: {
			alias: [
				{
					find: '@js',
					replacement: '/src/js',
				},
				{
					find: '@glsl',
					replacement: '/src/glsl',
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
		},
	});
};
