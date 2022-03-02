import { OrthographicCamera, Vector2 } from 'three';

import { getWebgl } from '@js/Webgl/Webgl';

const tVec2a = new Vector2();
const tVec2b = new Vector2();
const tVec2c = new Vector2();
const tVec2d = new Vector2();

export default class Mouse {
	constructor(opt = {}) {
		const webgl = getWebgl();
		this.camera = webgl.camera.instance;

		document.addEventListener(
			'mousemove',
			this.getMousesPositions.bind(this),
		);

		this.initMouses();
	}

	initMouses() {
		// Mouse's positions in the DOM
		this.dom = tVec2a;

		// Mouse's positions for fragment shader (x: [0, 1], y:[0, 1])
		this.frag = tVec2b;

		// Mouse's positions in the scene (x: [-1, 1], y:[-1, 1])
		this.scene = tVec2c;

		// ❗ Expérimental
		// Mouse's positions in the scene compared to the DOM size and the camera (x: [?, ?], y:[?, ?])
		this.sceneMap = tVec2d;
	}

	getMousesPositions(e) {
		this.dom.set(e.clientX, e.clientY);

		this.frag.set(
			this.dom.x / window.innerWidth,
			this.dom.y / window.innerHeight,
		);

		this.scene.set(
			(this.dom.x / window.innerWidth) * 2 - 1,
			-(this.dom.y / window.innerHeight) * 2 + 1,
		);

		this.sceneMap.set(
			this.cursorMap(
				this.scene.x,
				-1,
				1,
				-this.viewSize().width / 2,
				this.viewSize().width / 2,
			),
			this.cursorMap(
				this.scene.y,
				-1,
				1,
				-this.viewSize().height / 2,
				this.viewSize().height / 2,
			),
		);
	}

	cursorMap(mousePos, in_min, in_max, out_min, out_max) {
		return (
			((mousePos - in_min) * (out_max - out_min)) / (in_max - in_min) +
			out_min
		);
	}

	viewSize(objectPos = 0) {
		if (!this.camera instanceof OrthographicCamera) {
			width = height = vFov = 0;
			return { width, height, vFov };
		}

		let cameraZ = this.camera.position.z;
		let distance = cameraZ - objectPos; // Calcul the z distance between the camera and a random object ('could be a plane, a cube or whatever you want)
		let aspect = this.camera.aspect;

		let vFov = (this.camera.fov * Math.PI) / 180;
		let height = 2 * Math.tan(vFov / 2) * distance;
		let width = height * aspect;

		return { width, height, vFov };
	}

	destroy() {
		document.removeEventListener(
			'mousemove',
			this.getMousesPositions.bind(this),
		);
	}
}
