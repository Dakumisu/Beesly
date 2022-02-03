import Webgl from '@js/Webgl/Webgl';

import loadModel from '@utils/loader/loadGLTF';

import { Store } from '@js/Tools/Store';

import model from '/assets/model/model.glb';

let initialized = false;

export default class Model {
	constructor(opt = {}) {
		this.webgl = new Webgl();
		this.scene = this.webgl.scene;

		this.object = {};

		this.init();
	}

	init() {
		this.load();

		initialized = true;

		/// #if DEBUG
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {}
	/// #endif

	load() {
		loadModel(model).then((response) => {
			this.object.mesh = response;
			this.object.mesh.position.set(0, -2, 0);
			this.scene.add(this.object.mesh);
		});
	}

	addObject(object) {
		this.scene.add(object);
	}

	update(et) {
		if (!initialized) return;
	}
}
