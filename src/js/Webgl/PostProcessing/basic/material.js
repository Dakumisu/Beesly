import { RawShaderMaterial } from 'three';

import hotShaders from './hotShaders';

let instance;

export default class postProcessingMaterial extends RawShaderMaterial {
	constructor(opts = {}) {
		super();

		for (const opt in opts) {
			this[opt] = opts[opt];
		}

		hotShaders.use(this);
	}
}

postProcessingMaterial.get = (opts) =>
	(instance = instance || new postProcessingMaterial(opts));
