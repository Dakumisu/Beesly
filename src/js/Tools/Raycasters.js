import { Raycaster, ArrowHelper, Vector3 } from 'three';

import Emitter from './Emitter';

import Webgl from '@js/Webgl/Webgl';

let initialized = false;

export default class Raycasters extends Emitter {
	constructor(opt = {}) {
		super();

		const webgl = new Webgl();
		this.scene = webgl.scene;
		this.mouse = webgl.mouse.scene;
		this.camera = webgl.camera.instance;

		this.initRaycaster();

		/// #if DEBUG
		// WIP
		this.helpers = opt.helpers || false;
		if (this.helpers) {
			this.pos = opt.pos; // raycatser's position (pos: { x: -1, y: 2 })
			this.dir = opt.dir; // raycatser's direction (dir: { x: 2, y: -4 })
			this.initHelper();
		}
		/// #endif
	}

	/// #if DEBUG
	initHelper() {
		this.rayOrigin = new Vector3(this.pos.x, this.pos.y, 0);
		this.rayDirection = new Vector3(this.dir.x, this.dir.y, 0);
		this.rayDirection.normalize();

		this.raycaster.set(this.rayOrigin, this.rayDirection);

		this.length = 10;
		this.color = 0xffffff;

		this.arrowHelper = new ArrowHelper(
			this.rayDirection,
			this.rayOrigin,
			this.length,
			this.color,
		);
		this.scene.add(this.arrowHelper);
	}
	/// #endif

	initRaycaster() {
		this.raycaster = new Raycaster();
		this.raycaster.params.Points.threshold = 0.01; // ray' size

		initialized = true;
	}

	update() {
		if (!initialized) return;

		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true,
		);

		for (let i = 0; i < intersects.length; i++) {
			this.emit('raycast', [intersects[i].object]);
		}
	}
}
