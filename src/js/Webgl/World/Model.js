import { getWebgl } from '@webgl/Webgl';

import { loadGLTF } from '@utils/loader';

import model from '/assets/model/model.glb';

let initialized = false;

export default class Model {
	constructor(opt = {}) {
		const webgl = getWebgl();
		this.scene = webgl.scene.instance;

		this.object = {};

		this.load();

		initialized = true;
	}

	async load() {
		this.object.mesh = await loadGLTF(model);

		this.object.mesh.position.set(0, -2, 0);
		this.scene.add(this.object.mesh);
	}

	update(et) {
		if (!initialized) return;
	}

	destroy() {
		if (!initialized) return;

		initialized = false;
	}
}
