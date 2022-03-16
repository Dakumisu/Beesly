// Code from OGL
// https://github.com/oframe/ogl/blob/master/src/extras/Orbit.js

import { clamp } from 'philbin-packages/maths';
import { Vector3 as Vec3, Vector2 as Vec2, Vector3 } from 'three';

const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, DOLLY_PAN: 3 };
const tempVec3a = new Vec3();
const tempVec3b = new Vec3();
const tempVec2a = new Vec2();
const tempVec2b = new Vec2();

class Spherical {
	constructor(radius = 1, phi = 0, theta = 0) {
		this.set(radius, phi, theta);
	}

	set(radius, phi, theta) {
		this.radius = radius;
		this.phi = phi;
		this.theta = theta;
	}

	equals(spherical) {
		return (
			this.radius === spherical.radius &&
			this.phi === spherical.phi &&
			this.theta === spherical.theta
		);
	}

	copy(spherical) {
		this.radius = spherical.radius;
		this.phi = spherical.phi;
		this.theta = spherical.theta;
	}
}

function orbitController(
	object,
	{
		element = document,
		enabled = true,
		target = new Vec3(),
		ease = 0.25,
		inertia = 0.75,
		enableRotate = true,
		rotateSpeed = 0.1,
		autoRotate = false,
		autoRotateSpeed = 1.0,
		enableZoom = true,
		zoomSpeed = 1,
		enablePan = true,
		panSpeed = 0.1,
		fps = false,
		minPolarAngle = 0,
		maxPolarAngle = Math.PI,
		minAzimuthAngle = -Infinity,
		maxAzimuthAngle = Infinity,
		minDistance = 0.5,
		maxDistance = Infinity,
		useOrbitKeyboard = true,
	} = {},
) {
	const targetOffset = new Vec3();
	const offsetedTarget = new Vec3().copy(getTargetPosition(target));

	// Catch attempts to disable - set to 1 so has no effect
	ease = ease || 1;
	inertia = inertia || 0;

	// current position in sphericalTarget coordinates
	const sphericalDelta = new Spherical();
	const sphericalTarget = new Spherical();
	const spherical = new Spherical();
	const panDelta = new Vec3();

	// Grab initial position values
	const offset = new Vec3();
	updatePosition();

	// Touch pressed
	const pressed = [
		'ShiftLeft',
		'KeyZ',
		'KeyQ',
		'KeyS',
		'KeyD',
		'KeyC',
		'Space',
	].reduce((p, v) => ((p[v] = false), p), {});
	const zKeyDelta = new Vector3();

	function getTargetPosition() {
		if (!target.position) return target;
		target.getWorldPosition(tempVec3b);
		return tempVec3b;
	}

	function updatePosition() {
		// apply rotation to offset
		const sinPhiRadius =
			spherical.radius * Math.sin(Math.max(0.000001, spherical.phi));
		offset.x = sinPhiRadius * Math.sin(spherical.theta);
		offset.y = spherical.radius * Math.cos(spherical.phi);
		offset.z = sinPhiRadius * Math.cos(spherical.theta);

		// Apply updated values to object
		offsetedTarget.copy(getTargetPosition(target)).add(targetOffset);
		object.position.copy(offsetedTarget).add(offset);
		object.lookAt(offsetedTarget);
	}

	function update() {
		if (autoRotate) {
			handleAutoRotate();
		}

		// apply delta
		sphericalTarget.radius *= sphericalDelta.radius;
		sphericalTarget.theta += sphericalDelta.theta;
		sphericalTarget.phi += sphericalDelta.phi;

		// apply boundaries
		sphericalTarget.theta = clamp(
			sphericalTarget.theta,
			minAzimuthAngle,
			maxAzimuthAngle,
		);
		sphericalTarget.phi = clamp(
			sphericalTarget.phi,
			minPolarAngle,
			maxPolarAngle,
		);
		sphericalTarget.radius = clamp(
			sphericalTarget.radius,
			minDistance,
			maxDistance,
		);

		// ease values
		spherical.phi += (sphericalTarget.phi - spherical.phi) * ease;
		spherical.theta += (sphericalTarget.theta - spherical.theta) * ease;
		spherical.radius += (sphericalTarget.radius - spherical.radius) * ease;

		// apply pan to target. As offset is relative to target, it also shifts
		targetOffset.add(panDelta);

		updatePosition();

		// Apply inertia to values
		sphericalDelta.theta *= inertia;
		sphericalDelta.phi *= inertia;
		panDelta.multiplyScalar(inertia * 1.13);

		// Reset scale every frame to avoid applying scale multiple times
		sphericalDelta.radius = 1;

		const keyMult = pressed.ShiftLeft ? 4 : pressed.KeyC ? 0.25 : 1;
		const keySpeed = 0.1;
		if (enabled) {
			if (fps) {
				if (pressed.KeyW || pressed.KeyS) {
					object.getWorldPosition(tempVec3b);
					object
						.localToWorld(
							zKeyDelta.set(0, 0, pressed.KeyW ? -1 : 1),
						)
						.sub(tempVec3b)
						.multiplyScalar(0.25 * (keySpeed / 0.05) * keyMult);
				}
				if (pressed.Space) panUp(keySpeed * keyMult, object.matrix);
				if (pressed.KeyA) panLeft(keySpeed * keyMult, object.matrix);
				else if (pressed.KeyD)
					panLeft(-keySpeed * keyMult, object.matrix);
			} else {
				let panX = 0;
				let panY = 0;
				if (pressed.KeyW) panY = 2 * keyMult;
				else if (pressed.KeyS) panY = -2 * keyMult;
				if (pressed.KeyA) panX = 2 * keyMult;
				else if (pressed.KeyD) panX = -2 * keyMult;
				pan(panX, panY);
			}
		}

		targetOffset.add(zKeyDelta);
		zKeyDelta.multiplyScalar(inertia * 1.13);
	}

	function offsetToSpherical(offset, spherical) {
		spherical.radius = offset.length();
		spherical.theta = Math.atan2(offset.x, offset.z);
		spherical.phi = Math.acos(
			clamp(offset.y / sphericalTarget.radius, -1, 1),
		);
	}

	function setFPSMode(v) {
		if (fps === v) return;
		fps = v;

		if (fps) {
			object.getWorldPosition(tempVec3b);
			const dir = object
				.localToWorld(tempVec3a.set(0, 0, 1))
				.sub(tempVec3b)
				.multiplyScalar(spherical.radius);
			targetOffset.add(dir);
			spherical.radius = sphericalTarget.radius = 0.1;
		}
	}

	// Everything below here just updates panDelta and sphericalDelta
	// Using those two objects' values, the orbit is calculated

	const rotateStart = new Vec2();
	const panStart = new Vec2();
	const dollyStart = new Vec2();

	let state = STATE.NONE;
	const mouseButtons = { ORBIT: 0, ZOOM: 1, PAN: 2 };

	function getZoomScale() {
		return Math.pow(0.95, zoomSpeed);
	}

	function panLeft(distance, m) {
		m = m.elements;
		tempVec3a.set(m[0], m[1], m[2]);
		tempVec3a.multiplyScalar(-distance);
		panDelta.add(tempVec3a);
	}

	function panUp(distance, m) {
		m = m.elements;
		tempVec3a.set(m[4], m[5], m[6]);
		tempVec3a.multiplyScalar(distance);
		panDelta.add(tempVec3a);
	}

	const pan = (deltaX, deltaY) => {
		const el = element === document ? document.body : element;
		const height =
			el === document.body ? window.innerHeight : el.clientHeight;
		tempVec3a.copy(object.position).sub(targetOffset);
		let targetDistance = tempVec3a.length();
		targetDistance *= Math.tan(
			(((object.fov || 45) / 2) * Math.PI) / 180.0,
		);
		panLeft((2 * deltaX * targetDistance) / height, object.matrix);
		panUp((2 * deltaY * targetDistance) / height, object.matrix);
	};

	const dolly = (dollyScale) => {
		sphericalDelta.radius /= dollyScale;
	};

	function handleAutoRotate() {
		const angle = ((2 * Math.PI) / 60 / 60) * autoRotateSpeed;
		sphericalDelta.theta -= angle;
	}

	function handleMoveRotate(x, y) {
		tempVec2a.set(x, y);
		tempVec2b
			.subVectors(tempVec2a, rotateStart)
			.multiplyScalar(rotateSpeed);
		const el = element === document ? document.body : element;
		const height =
			el === document.body ? window.innerHeight : el.clientHeight;
		sphericalDelta.theta -= (2 * Math.PI * tempVec2b.x) / height;
		sphericalDelta.phi -= (2 * Math.PI * tempVec2b.y) / height;
		rotateStart.copy(tempVec2a);
	}

	function handleMouseMoveDolly(e) {
		tempVec2a.set(e.clientX, e.clientY);
		tempVec2b.subVectors(tempVec2a, dollyStart);
		if (tempVec2b.y > 0) {
			dolly(getZoomScale());
		} else if (tempVec2b.y < 0) {
			dolly(1 / getZoomScale());
		}
		dollyStart.copy(tempVec2a);
	}

	function handleMovePan(x, y) {
		tempVec2a.set(x, y);
		tempVec2b.subVectors(tempVec2a, panStart).multiplyScalar(panSpeed);
		pan(tempVec2b.x, tempVec2b.y);
		panStart.copy(tempVec2a);
	}

	function handleTouchStartDollyPan(e) {
		if (enableZoom) {
			const dx = e.touches[0].pageX - e.touches[1].pageX;
			const dy = e.touches[0].pageY - e.touches[1].pageY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			dollyStart.set(0, distance);
		}

		if (enablePan) {
			const x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
			const y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
			panStart.set(x, y);
		}
	}

	function handleTouchMoveDollyPan(e) {
		if (enableZoom) {
			const dx = e.touches[0].pageX - e.touches[1].pageX;
			const dy = e.touches[0].pageY - e.touches[1].pageY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			tempVec2a.set(0, distance);
			tempVec2b.set(0, Math.pow(tempVec2a.y / dollyStart.y, zoomSpeed));
			dolly(tempVec2b.y);
			dollyStart.copy(tempVec2a);
		}

		if (enablePan) {
			const x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
			const y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
			handleMovePan(x, y);
		}
	}

	function getPath(e) {
		let path = [];
		let currentElem = e.target;
		while (currentElem) {
			path.push(currentElem);
			currentElem = currentElem.parentElement;
		}
		if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
			path.push(document);
		if (path.indexOf(window) === -1) path.push(window);
		return path;
	}

	function canClick(e) {
		const path = getPath(e);
		for (const el of path) {
			if (!el || !el.classList) break;
			if (el.classList.contains('debug')) return false;
		}
		return true;
	}

	const onMouseDown = (e) => {
		if (!enabled) return;
		if (!canClick(e)) return;

		switch (e.button) {
			case mouseButtons.ORBIT:
				if (enableRotate === false) return;
				rotateStart.set(e.clientX, e.clientY);
				state = STATE.ROTATE;
				break;
			case mouseButtons.ZOOM:
				if (enableZoom === false) return;
				dollyStart.set(e.clientX, e.clientY);
				state = STATE.DOLLY;
				break;
			case mouseButtons.PAN:
				if (enablePan === false) return;
				panStart.set(e.clientX, e.clientY);
				state = STATE.PAN;
				break;
		}

		if (state !== STATE.NONE) {
			window.addEventListener('mousemove', onMouseMove, false);
			window.addEventListener('mouseup', onMouseUp, false);
		}
	};

	const onMouseMove = (e) => {
		if (!enabled) return;

		switch (state) {
			case STATE.ROTATE:
				if (enableRotate === false) return;
				handleMoveRotate(e.clientX, e.clientY);
				break;
			case STATE.DOLLY:
				if (fps || enableZoom === false) return;
				handleMouseMoveDolly(e);
				break;
			case STATE.PAN:
				if (fps || enablePan === false) return;
				handleMovePan(e.clientX, e.clientY);
				break;
		}
	};

	const onMouseUp = () => {
		window.removeEventListener('mousemove', onMouseMove, false);
		window.removeEventListener('mouseup', onMouseUp, false);
		state = STATE.NONE;
	};

	const onMouseWheel = (e) => {
		if (
			!enabled ||
			!enableZoom ||
			(state !== STATE.NONE && state !== STATE.ROTATE) ||
			fps
		)
			return;

		if (!canClick(e)) return;

		e.stopPropagation();
		e.preventDefault();

		if (e.deltaY < 0) {
			dolly(1 / getZoomScale());
		} else if (e.deltaY > 0) {
			dolly(getZoomScale());
		}
	};

	const onTouchStart = (e) => {
		if (!enabled) return;
		if (!canClick(e)) return;

		e.preventDefault();

		switch (e.touches.length) {
			case 1:
				if (enableRotate === false) return;
				rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
				state = STATE.ROTATE;
				break;
			case 2:
				if (enableZoom === false && enablePan === false) return;
				handleTouchStartDollyPan(e);
				state = STATE.DOLLY_PAN;
				break;
			default:
				state = STATE.NONE;
		}
	};

	const onTouchMove = (e) => {
		if (!enabled) return;
		e.preventDefault();
		e.stopPropagation();

		switch (e.touches.length) {
			case 1:
				if (enableRotate === false) return;
				handleMoveRotate(e.touches[0].pageX, e.touches[0].pageY);
				break;
			case 2:
				if (enableZoom === false && enablePan === false) return;
				handleTouchMoveDollyPan(e);
				break;
			default:
				state = STATE.NONE;
		}
	};

	const onTouchEnd = () => {
		if (!enabled) return;
		state = STATE.NONE;
	};

	const onContextMenu = (e) => {
		if (!enabled) return;
		if (!canClick(e)) return;
		e.preventDefault();
	};

	const keyBlacklistTag = ['INPUT', 'TEXTAREA', 'SELECT'];
	const keyAliases = {
		ArrowUp: 'KeyW',
		ArrowDown: 'KeyS',
		ArrowLeft: 'KeyA',
		ArrowRight: 'KeyD',
	};

	const keyCodes = Object.keys(pressed).reduce(
		(p, v) => ((p[v] = true), p),
		{},
	);

	const onKeyDown = (e) => {
		if (!enabled) return;
		if (!canClick(e)) return;
		if (!useOrbitKeyboard && !fps) return;
		const code = keyAliases[e.code] || e.code;
		if (keyBlacklistTag.includes(e.target.tagName)) return;
		if (!keyCodes[code] || pressed[code]) return;
		pressed[code] = true;
	};

	const onKeyUp = (e) => {
		const code = keyAliases[e.code] || e.code;
		if (!keyCodes[code] || !pressed[code]) return;
		pressed[code] = false;
	};

	const unpressAllKeys = () => {
		for (const k in pressed) {
			pressed[k] = false;
		}
	};

	function addHandlers() {
		window.addEventListener('blur', unpressAllKeys, false);
		element.addEventListener('keydown', onKeyDown, false);
		element.addEventListener('keyup', onKeyUp, false);
		element.addEventListener('contextmenu', onContextMenu, false);
		element.addEventListener('mousedown', onMouseDown, false);
		element.addEventListener('wheel', onMouseWheel, { passive: false });
		element.addEventListener('touchstart', onTouchStart, {
			passive: false,
		});
		element.addEventListener('touchend', onTouchEnd, false);
		element.addEventListener('touchmove', onTouchMove, { passive: false });
	}

	function remove() {
		window.removeEventListener('blur', unpressAllKeys);
		element.removeEventListener('contextmenu', onContextMenu);
		element.removeEventListener('mousedown', onMouseDown);
		element.removeEventListener('wheel', onMouseWheel);
		element.removeEventListener('touchstart', onTouchStart);
		element.removeEventListener('touchend', onTouchEnd);
		element.removeEventListener('touchmove', onTouchMove);
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	}

	addHandlers();

	return {
		remove,
		update,
		updatePosition,
		offsetToSpherical,
		setFPSMode,
		pan,
		dolly,
		get offsetedTarget() {
			return offsetedTarget;
		},
		get targetOffset() {
			return targetOffset;
		},
		set target(v) {
			target = v;
		},
		get target() {
			return target;
		},
		set enabled(v) {
			enabled = v;
		},
		get enabled() {
			return enabled;
		},
		get spherical() {
			return spherical;
		},
		get sphericalTarget() {
			return sphericalTarget;
		},
	};
}

export default orbitController;
export { orbitController, Spherical };
