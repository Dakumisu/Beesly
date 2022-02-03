import {
	AdditiveBlending,
	Color,
	DoubleSide,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	LinearFilter,
	MathUtils,
	Mesh,
	PlaneBufferGeometry,
	RGBFormat,
	ShaderMaterial,
	SphereBufferGeometry,
	Vector3,
	VideoTexture,
} from 'three';

import Webgl from '@js/Webgl/Webgl';

import { Store } from '@js/Tools/Store';

import vertex from '@glsl/particles/vertex.glsl';
import fragment from '@glsl/particles/fragment.glsl';

const tVec3 = new Vector3();
const tCol = new Color();

const params = {
	color: '#ffffff',
};

let initialized = false;

/* FBO Particles coming soon */
export default class Particles {
	constructor(opt = {}) {
		this.webgl = new Webgl();
		this.scene = this.webgl.scene;

		this.object = {};

		this.count = 2048;

		this.init();
	}

	init() {
		this.setAttributes();
		this.setGeometry();
		this.setMaterial();
		this.setMesh();

		this.resize();

		initialized = true;

		/// #if DEBUG
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		this.debugFolder = this.webgl.debug.addFolder({
			title: 'Particles',
			expanded: true,
		});

		this.debugFolder.addInput(params, 'color').on('change', (e) => {
			tCol.set(e.value);
		});
	}
	/// #endif

	setAttributes() {
		const particlesCount = this.count;

		this.positions = new Float32Array(particlesCount * 3);
		this.offset = new Float32Array(particlesCount * 1);
		this.scale = new Float32Array(particlesCount * 1);

		for (let i = 0; i < particlesCount; i++) {
			this.positions[i * 3 + 0] = MathUtils.randFloatSpread(1);
			this.positions[i * 3 + 1] = MathUtils.randFloatSpread(1);
			this.positions[i * 3 + 2] = MathUtils.randFloatSpread(1);

			this.offset[i + 0] = MathUtils.randFloatSpread(50);
			this.scale[i + 0] = MathUtils.randFloat(0.5, 1.5);
		}
	}

	setGeometry() {
		const blueprintParticle = new PlaneBufferGeometry();
		blueprintParticle.scale(0.01, 0.01, 0.01);

		this.object.geometry = new InstancedBufferGeometry();

		this.object.geometry.index = blueprintParticle.index;
		this.object.geometry.attributes.position =
			blueprintParticle.attributes.position;
		this.object.geometry.attributes.normal =
			blueprintParticle.attributes.normal;
		this.object.geometry.attributes.uv = blueprintParticle.attributes.uv;

		this.object.geometry.setAttribute(
			'aPositions',
			new InstancedBufferAttribute(this.positions, 3, false),
		);
		this.object.geometry.setAttribute(
			'aOffset',
			new InstancedBufferAttribute(this.offset, 1, false),
		);
		this.object.geometry.setAttribute(
			'aScale',
			new InstancedBufferAttribute(this.scale, 1, false),
		);
	}

	setMaterial() {
		this.object.material = new ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: tCol.set(params.color) },
				uAlpha: { value: 1 },
				uResolution: {
					value: tVec3.set(
						Store.resolution.width,
						Store.resolution.height,
						Store.resolution.dpr,
					),
				},
			},
			side: DoubleSide,
			transparent: true,

			/* for particles */
			depthTest: true,
			depthWrite: false,
			blending: AdditiveBlending,
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
		if (!initialized) return;

		this.object.mesh.material.uniforms.uTime.value = et;
	}
}
