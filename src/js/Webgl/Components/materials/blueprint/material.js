import { ShaderMaterial } from 'three';

import hotShaders from './hotShaders';

let instance;

export default class blueprintMaterial extends ShaderMaterial {
	constructor(opts = {}) {
		super();

		for (const opt in opts) {
			this[opt] = opts[opt];
		}

		hotShaders.use(this);
	}
}

blueprintMaterial.get = (opts) =>
	(instance = instance || new blueprintMaterial(opts));
