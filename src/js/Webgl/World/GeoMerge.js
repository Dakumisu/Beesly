import {
	Color,
	DoubleSide,
	Mesh,
	MeshNormalMaterial,
	PlaneBufferGeometry,
	ShaderMaterial,
	Vector3,
} from 'three';

import { getWebgl } from '@js/Webgl/Webgl';

import mergeGeometry from '@utils/webgl/mergeBufferGeometries';

import model from '/assets/model/model.glb';

let initialized = false;

export default class GeoMerge {
	constructor(opt = {}) {
		const webgl = getWebgl();
		this.scene = webgl.scene.instance;

		this.object = {};

		this.merge();

		initialized = true;
	}

	async merge() {
		const geometry = await mergeGeometry([], [model]);
		if (!geometry) return;

		this.object.geometry = geometry;
		this.object.mesh = new Mesh(
			this.object.geometry,
			new MeshNormalMaterial({ side: DoubleSide }),
		);
		this.object.mesh.position.set(0, 2, 0);
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
