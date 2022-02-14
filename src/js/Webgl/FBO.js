import {
	LinearFilter,
	PerspectiveCamera,
	RGBAFormat,
	Scene,
	sRGBEncoding,
	WebGLMultisampleRenderTarget,
	WebGLRenderTarget,
} from 'three';

import { store } from '@js/Tools/Store';

export default class FBO {
	constructor(opt = {}) {
		this.setScene();
		this.setCamera();
		this.setRenderTarget();
	}

	setScene() {
		this.scene = new Scene();
	}

	setCamera() {
		this.camera = new PerspectiveCamera(
			30,
			store.resolution.width / store.resolution.height,
			0.1,
			1000,
		);
		this.camera.position.set(0, 0, 3);
		this.camera.rotation.reorder('YXZ');
	}

	setRenderTarget() {
		const RenderTargetClass =
			store.resolution.dpr >= 2
				? WebGLRenderTarget
				: WebGLMultisampleRenderTarget;

		this.renderTarget = new RenderTargetClass(
			store.resolution.width,
			store.resolution.height,
			{
				generateMipmaps: false,
				minFilter: LinearFilter,
				magFilter: LinearFilter,
				format: RGBAFormat,
				encoding: sRGBEncoding,
			},
		);
	}

	resize() {
		this.renderTarget.setSize(
			store.resolution.width,
			store.resolution.height,
		);
		this.renderTarget.setPixelRatio(Math.min(store.resolution.dpr, 2));
	}

	preRender(renderer) {
		renderer.setRenderTarget(this.renderTarget);
	}

	render(renderer) {
		renderer.render(this.scene, this.camera);
	}

	postRender(renderer) {
		renderer.setRenderTarget(null);
	}

	destroy() {
		this.renderTarget.dispose();
	}
}
