import { ShaderMaterial } from 'three';

import hotShaders from './hotShaders';

let instance;

export default class particlesMaterial extends ShaderMaterial {
	constructor(opts = {}) {
		super();

		for (const opt in opts) {
			this[opt] = opts[opt];
		}

		hotShaders.use(this);
	}
}

particlesMaterial.get = (opts) =>
	(instance = instance || new particlesMaterial(opts));
