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

export default class Blueprint {
	constructor(opt = {}) {
		this.webgl = new Webgl();
		this.scene = this.webgl.scene;

		this.object = {};

		this.initialized = false;

		this.init();
	}

	init() {
		this.setGeometry();
		this.setMaterial();
		this.setMesh();

		this.resize();

		this.initialized = true;

		/// #if DEBUG
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {}
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
		this.object.mesh.frustumCulled = false;

		this.addObject(this.object.mesh);
	}

	addObject(object) {
		this.scene.add(object);
	}

	resize() {
		this.object.material.uniforms.uResolution.value = tVec3.set(
			Store.resolution.width,
			Store.resolution.height,
			Store.resolution.dpr,
		);
	}

	update(et) {
		if (!this.initialized) return;

		this.object.material.uniforms.uTime.value = et;
	}
}
