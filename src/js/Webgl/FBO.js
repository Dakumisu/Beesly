import {
	LinearFilter,
	PerspectiveCamera,
	RGBAFormat,
	Scene,
	sRGBEncoding,
	WebGLMultisampleRenderTarget,
	WebGLRenderTarget,
} from 'three';

import Webgl from './Webgl';

import { Store } from '@js/Tools/Store';

export default class FBO {
	constructor(opt = {}) {
		this.webgl = new Webgl();

		this.init();
	}

	init() {
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
			Store.resolution.width / Store.resolution.height,
			0.1,
			1000,
		);
		this.camera.position.set(0, 0, 3);
		this.camera.rotation.reorder('YXZ');
	}

	setRenderTarget() {
		const RenderTargetClass =
			Store.resolution.dpr >= 2
				? WebGLRenderTarget
				: WebGLMultisampleRenderTarget;

		this.renderTarget = new RenderTargetClass(
			Store.resolution.width,
			Store.resolution.height,
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
			Store.resolution.width,
			Store.resolution.height,
		);
		this.renderTarget.setPixelRatio(Math.min(Store.resolution.dpr, 2));
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
