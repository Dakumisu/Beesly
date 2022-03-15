import signal from 'philbin-packages/signal';

import { Raycaster } from 'three';

import { getWebgl } from '@webgl/Webgl';

let initialized = false;

export default class Raycast {
	constructor(opt = {}) {
		const webgl = getWebgl();
		this.scene = webgl.scene.instance;
		this.mouse = webgl.mouse.scene;
		this.camera = webgl.camera.instance;

		this.init();
	}

	init() {
		this.raycaster = new Raycaster();
		this.raycaster.params.Points.threshold = 0.01; // ray' size

		initialized = true;
	}

	destroy() {
		if (!initialized) return;

		initialized = false;
	}

	update() {
		if (!initialized) return;

		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true,
		);

		for (let i = 0; i < intersects.length; i++) {
			signal.emit('raycast', intersects[i].object);
		}
	}
}
