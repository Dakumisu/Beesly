import path from 'path';

const noop = () => true;
const { parse } = require('./preprocessor');

const EXTS = ['.cjs', '.jsx', '.js', '.mjs'].reduce(
	(p, v) => ((p[v] = true), p),
	{},
);

let test = false;
module.exports = function ifdefRollupPlugin(defines) {
	if (!defines) defines = {};
	if (!test) test = noop;

	const fileRegex = /\.jsx?$/;

	return {
		name: 'rollup-ifdef-plugin',
		enforce: 'pre',
		async transform(src, id) {
			if (!test(id)) return;
			const ext = path.extname(id).split('?v')[0];
			if (!EXTS[ext]) return;

			const verbose = false;
			const tripleSlash = true;
			const fillWithBlanks = true;
			const uncommentPrefix = '/// #code';
			const filePath = id;

			const source = parse(
				src,
				defines,
				verbose,
				tripleSlash,
				filePath,
				fillWithBlanks,
				uncommentPrefix,
			);

			return {
				code: source,
				map: null,
			};
		},
	};
};
