export default {
	input: 'src/app.js',
	output: {
		file: 'app.js',
		format: 'cjs',
	},
	treeshake: {
		moduleSideEffects: false,
		tryCatchDeoptimization: true,
		propertyReadSideEffects: true,
		unknownGlobalSideEffects: true,
	},
};
