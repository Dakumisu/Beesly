import {
	Color,
	DoubleSide,
	Mesh,
	MeshNormalMaterial,
	PlaneBufferGeometry,
	ShaderMaterial,
	Vector3,
} from 'three';

import Webgl from '@js/Webgl/Webgl';

import mergeGeometry from '@utils/webgl/mergeBufferGeometries';

import { Store } from '@js/Tools/Store';

import model from '/assets/model/model.glb';

let initialized = false;

export default class GeoMerge {
	constructor(opt = {}) {
		this.webgl = new Webgl();
		this.scene = this.webgl.scene;

		this.object = {};

		this.init();
	}

	init() {
		this.merge();

		initialized = true;

		/// #if DEBUG
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {}
	/// #endif

	merge() {
		mergeGeometry([], [model]).then((response) => {
			if (!response) return;
			this.object.geometry = response;
			this.object.mesh = new Mesh(
				this.object.geometry,
				new MeshNormalMaterial({ side: DoubleSide }),
			);
			this.object.mesh.position.set(0, 2, 0);
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
