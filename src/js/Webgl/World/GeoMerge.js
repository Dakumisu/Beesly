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

import model from '@public/model/model.glb';

export default class GeoMerge {
	constructor(opt = {}) {
		this.webgl = new Webgl();
		this.scene = this.webgl.scene;

		this.initialized = false;

		this.init();
	}

	init() {
		this.merge();

		this.initialized = true;

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
			this.geometry = response;
			const mesh = new Mesh(
				this.geometry,
				new MeshNormalMaterial({ side: DoubleSide }),
			);
			mesh.position.set(0, 2, 0);
			this.scene.add(mesh);
		});
	}

	addObject(object) {
		this.scene.add(object);
	}

	update(et) {
		if (!this.initialized) return;
	}
}
