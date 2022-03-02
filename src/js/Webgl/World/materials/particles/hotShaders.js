import { hotMaterial } from 'philbin-packages/webgl';

import vs from './vertex.glsl';
import fs from './fragment.glsl';

let hmr = false;
/// #if DEBUG
hmr = true;
/// #endif

export default hotMaterial(
	vs,
	fs,
	(update) => {
		if (import.meta.hot) import.meta.hot.accept(update);
	},
	hmr,
);
