/*
	Credits @luruke (https://luruke.medium.com/simple-postprocessing-in-three-js-91936ecadfb7) ⚡️
*/

import {
	WebGLRenderTarget,
	OrthographicCamera,
	RGBFormat,
	BufferGeometry,
	BufferAttribute,
	Mesh,
	Scene,
	RawShaderMaterial,
	Vector2,
	Vector3,
} from 'three';

import { getWebgl } from '../Webgl';

import { store } from '@js/Tools/Store';

import postProcessingMaterial from './basic/material';

const tVec2 = new Vector2();
const tVec3 = new Vector3();

let initialized = false;

export default class PostFX {
	constructor(renderer) {
		const webgl = getWebgl();
		this.rendererScene = webgl.scene.instance;
		this.rendererCamera = webgl.camera.instance;

		this.renderer = renderer;

		this.renderer.getDrawingBufferSize(tVec2);

		this.usePostprocess = false;

		this.setEnvironnement();
		this.setTriangle();
		this.setRenderTarget();
		this.setMaterial();
		this.setPostPro();

		initialized = true;
	}

	setEnvironnement() {
		this.scene = new Scene();
		this.dummyCamera = new OrthographicCamera(1 / -2, 1 / 2, 1 / 2, 1 / -2);
	}

	setTriangle() {
		this.geometry = new BufferGeometry();

		const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]);

		this.geometry.setAttribute(
			'position',
			new BufferAttribute(vertices, 2),
		);
	}

	setRenderTarget() {
		this.target = new WebGLRenderTarget(tVec2.x, tVec2.y, {
			format: RGBFormat,
			stencilBuffer: false,
			depthBuffer: true,
		});
	}

	setMaterial() {
		const opts = {
			uniforms: {
				uScene: { value: this.target.texture },
				uResolution: { value: tVec3 },
			},
		};

		this.material = postProcessingMaterial.get(opts);
	}

	setPostPro() {
		this.triangle = new Mesh(this.geometry, this.material);
		this.triangle.frustumCulled = false;

		this.scene.add(this.triangle);
	}

	resize(width, height) {
		if (!initialized) return;

		tVec2.set(width, height);
		tVec3.set(tVec2.x, tVec2.y, store.resolution.dpr);

		this.material.uniforms.uResolution.value = tVec3;
	}

	render() {
		if (!initialized) return;

		this.renderer.setRenderTarget(this.target);
		this.renderer.render(this.rendererScene, this.rendererCamera);
		this.renderer.setRenderTarget(null);
		this.renderer.render(this.scene, this.dummyCamera);
	}

	destroy() {
		this.target.dispose();
	}
}
