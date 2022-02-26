import {
	AdditiveBlending,
	Color,
	DoubleSide,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	MathUtils,
	Mesh,
	PlaneGeometry,
	Vector3,
} from 'three';

import Webgl from '@js/Webgl/Webgl';

import { store } from '@js/Tools/Store';

import particlesMaterial from './materials/particles/material';

const tVec3 = new Vector3();
const tCol = new Color();

const params = {
	color: '#ffffff',
	size: 0.01,
};

const particlesCountList = [500, 1000, 5000, 10000, 30000, 50000];

const blueprintParticle = new PlaneGeometry();
blueprintParticle.scale(params.size, params.size, params.size);

let initialized = false;

/// #if DEBUG
const debug = {
	instance: null,
	label: 'Particles',
};
/// #endif

/* FBO Particles coming soon */
export default class Particles {
	constructor(opt = {}) {
		const webgl = new Webgl();
		const performance = webgl.performance;
		this.scene = webgl.scene;

		performance.on('quality', (quality) => {
			this.count = particlesCountList[quality];
			this.updateAttributes();
		});

		this.object = {};

		this.count = particlesCountList[5];

		this.setAttributes();
		this.setGeometry();
		this.setMaterial();
		this.setMesh();

		this.resize();

		initialized = true;

		/// #if DEBUG
		debug.instance = webgl.debug;
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		debug.instance.setFolder(debug.label);
		const gui = debug.instance.getFolder(debug.label);

		gui.addInput(params, 'color').on('change', (color) => {
			tCol.set(color.value);
		});
	}
	/// #endif

	setAttributes() {
		const particlesCount = this.count;

		this.position = new Float32Array(particlesCount * 3);
		this.offset = new Float32Array(particlesCount * 1);
		this.scale = new Float32Array(particlesCount * 1);

		for (let i = 0; i < particlesCount; i++) {
			this.position[i * 3 + 0] = MathUtils.randFloatSpread(1);
			this.position[i * 3 + 1] = MathUtils.randFloatSpread(1);
			this.position[i * 3 + 2] = MathUtils.randFloatSpread(1);

			this.offset[i + 0] = MathUtils.randFloatSpread(50);

			this.scale[i + 0] = MathUtils.randFloat(0.5, 1.5);
		}
	}

	updateAttributes() {
		const particlesCount = this.count;

		this.newPosition = new Float32Array(particlesCount * 3);
		this.newOffset = new Float32Array(particlesCount * 1);
		this.newScale = new Float32Array(particlesCount * 1);

		for (let i = 0; i < particlesCount; i++) {
			this.newPosition[i * 3 + 0] = this.position[i * 3 + 0];
			this.newPosition[i * 3 + 1] = this.position[i * 3 + 1];
			this.newPosition[i * 3 + 2] = this.position[i * 3 + 2];

			this.newOffset[i + 0] = this.offset[i + 0];

			this.newScale[i + 0] = this.scale[i + 0];
		}

		this.updateGeometry();
	}

	updateGeometry() {
		this.object.geometry = new InstancedBufferGeometry();

		this.object.geometry.index = blueprintParticle.index;
		this.object.geometry.attributes.position =
			blueprintParticle.attributes.position;
		this.object.geometry.attributes.normal =
			blueprintParticle.attributes.normal;
		this.object.geometry.attributes.uv = blueprintParticle.attributes.uv;

		this.object.geometry.setAttribute(
			'aPosition',
			new InstancedBufferAttribute(this.newPosition, 3, false),
		);
		this.object.geometry.setAttribute(
			'aOffset',
			new InstancedBufferAttribute(this.newOffset, 1, false),
		);
		this.object.geometry.setAttribute(
			'aScale',
			new InstancedBufferAttribute(this.newScale, 1, false),
		);

		this.object.mesh.geometry = this.object.geometry;
	}

	setGeometry() {
		this.object.geometry = new InstancedBufferGeometry();

		this.object.geometry.index = blueprintParticle.index;
		this.object.geometry.attributes.position =
			blueprintParticle.attributes.position;
		this.object.geometry.attributes.normal =
			blueprintParticle.attributes.normal;
		this.object.geometry.attributes.uv = blueprintParticle.attributes.uv;

		this.object.geometry.setAttribute(
			'aPosition',
			new InstancedBufferAttribute(this.position, 3, false),
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
		const opts = {
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: tCol.set(params.color) },
				uAlpha: { value: 1 },
				uResolution: {
					value: tVec3.set(
						store.resolution.width,
						store.resolution.height,
						store.resolution.dpr,
					),
				},
			},
			side: DoubleSide,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			blending: AdditiveBlending,
		};
		this.object.material = particlesMaterial.get(opts);
	}

	setMesh() {
		this.object.mesh = new Mesh(this.object.geometry, this.object.material);
		this.object.mesh.frustumCulled = false;

		this.scene.add(this.object.mesh);
	}

	resize() {
		if (!initialized) return;

		tVec3.set(
			store.resolution.width,
			store.resolution.height,
			store.resolution.dpr,
		);

		this.object.material.uniforms.uResolution.value = tVec3;
	}

	update(et) {
		if (!initialized) return;

		this.object.mesh.material.uniforms.uTime.value = et;
	}
}
