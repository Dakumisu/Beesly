import {
	Color,
	DoubleSide,
	Mesh,
	PlaneBufferGeometry,
	ShaderMaterial,
	Vector2,
	Vector3,
} from 'three';

import Webgl from '@js/Webgl/Webgl';

import { Store } from '@js/Tools/Store';

import vertex from '@glsl/blueprint/vertex.glsl';
import fragment from '@glsl/blueprint/fragment.glsl';

const twoPI = Math.PI * 2;
const tVec3 = new Vector3();
const tVec2 = new Vector2();
const tCol = new Color();

let initialized = false;

export default class Blueprint {
	constructor(opt = {}) {
		const webgl = new Webgl();
		this.scene = webgl.scene;

		this.object = {};

		this.setGeometry();
		this.setMaterial();
		this.setMesh();

		this.resize();

		initialized = true;

		/// #if DEBUG
		const debug = webgl.debug;
		this.debug(debug);
		/// #endif
	}

	/// #if DEBUG
	debug(debug) {}
	/// #endif

	setGeometry() {
		this.object.geometry = new PlaneBufferGeometry(1, 1, 1, 1);
	}

	setMaterial() {
		this.object.material = new ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: tCol.set('#ffffff') },
				uAlpha: { value: 1 },
				uResolution: {
					value: tVec3.set(
						Store.resolution.width,
						Store.resolution.height,
						Store.resolution.dpr,
					),
				},
				uAspect: {
					value: tVec2.set(Store.aspect.a1, Store.aspect.a2),
				},
			},
			side: DoubleSide,
			transparent: true,
		});
	}

	setMesh() {
		this.object.mesh = new Mesh(this.object.geometry, this.object.material);

		this.scene.add(this.object.mesh);
	}

	resize() {
		this.object.material.uniforms.uResolution.value = tVec3.set(
			Store.resolution.width,
			Store.resolution.height,
			Store.resolution.dpr,
		);
	}

	update(et) {
		if (!initialized) return;

		this.object.material.uniforms.uTime.value = et;
	}
}
