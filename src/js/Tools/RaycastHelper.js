import signal from 'philbin-packages/signal';

import { Raycaster, ArrowHelper, Vector3, Color } from 'three';

import { getWebgl } from '@webgl/Webgl';

const params = {
	color: '#ffffff',
	size: 10,
	precision: 0.01, // ray' size
};

let initialized = false;

export default class RaycastHelper {
	constructor(opt = {}) {
		const webgl = getWebgl();
		this.scene = webgl.scene.instance;

		if (!opt.pos || !opt.dir) {
			console.error(
				`Raycast helper need a position's [x, x, x] array and a direction's array [x, x, x]`,
			);
			return;
		}
		if (opt.pos.length !== 3 || opt.dir.length !== 3) {
			console.error(
				`Raycast helper need a position's [x, x, x] array and a direction's array [x, x, x]`,
			);
			return;
		}

		this.position = opt.pos; // raycatser's position (pos: { x: Number, y: Number, z: Number })
		this.direction = opt.dir; // raycatser's direction (dir: { x: Number, y: Number, z: Number })

		if (opt.color) params.color = opt.color;
		if (opt.size) params.size = opt.size;
		if (opt.precision) params.precision = opt.precision;

		this.initHelper();
	}

	initHelper() {
		const rayOrigin = new Vector3().fromArray(this.position);
		const rayDirection = new Vector3().fromArray(this.direction);
		rayDirection.normalize();

		this.raycaster = new Raycaster();
		this.raycaster.params.Points.threshold = params.precision;
		this.raycaster.set(rayOrigin, rayDirection);

		const length = params.size;
		const color = new Color().set(params.color);

		const headLength = 0.45;
		const headWidth = 0.12;

		this.base = new ArrowHelper(
			rayDirection,
			rayOrigin,
			length,
			color,
			headLength,
			headWidth,
		);
		this.scene.add(this.base);

		initialized = true;
	}

	destroy() {
		initialized = false;
	}

	update() {
		if (!initialized) return;

		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true,
		);

		for (let i = 0; i < intersects.length; i++) {
			signal.emit('helper_raycast', intersects[i].object);
		}
	}
}
