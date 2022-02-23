import Webgl from '@js/Webgl/Webgl';

import loadModel from '@utils/loader/loadGLTF';

import { store } from '@js/Tools/Store';

import model from '/assets/model/model.glb';

let initialized = false;

export default class Model {
	constructor(opt = {}) {
		const webgl = new Webgl();
		this.scene = webgl.scene;

		this.object = {};

		this.load();

		initialized = true;
	}

	async load() {
		this.object.mesh = await loadModel(model);

		this.object.mesh.position.set(0, -2, 0);
		this.scene.add(this.object.mesh);
	}

	addObject(object) {
		this.scene.add(object);
	}

	update(et) {
		if (!initialized) return;
	}
}
