import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { orbitController } from '@utils/webgl';

import { getWebgl } from './Webgl';

import { store } from '@tools/Store';
import { imageAspect } from 'philbin-packages/maths';

let initialized = false;

export default class Camera {
	constructor(opt = {}) {
		const webgl = getWebgl();
		this.scene = webgl.scene.instance;
		this.canvas = webgl.canvas;

		this.type = opt.type || 'Perspective';

		this.init();
	}

	init() {
		this.type == 'Orthographic'
			? this.setOrthographicCamera()
			: this.setPerspectiveCamera();

		/// #if DEBUG
		this.setDebugCamera();
		/// #endif

		initialized = true;
	}

	setPerspectiveCamera() {
		this.instance = new PerspectiveCamera(
			75,
			store.aspect.ratio,
			0.1,
			1000,
		);
		this.instance.position.set(2, 3, 3);
		this.instance.lookAt(0, 0, 0);
		this.instance.rotation.reorder('YXZ');

		this.scene.add(this.instance);
	}

	setOrthographicCamera() {
		const frustrumSize = 1;
		this.instance = new OrthographicCamera(
			frustrumSize / -2,
			frustrumSize / 2,
			frustrumSize / 2,
			frustrumSize / -2,
			-1000,
			1000,
		);
		this.instance.position.set(0, 0, 1);

		// If you want to keep the aspect of your image
		const aspect = 1 / 1; // Aspect of the displayed image
		const imgAspect = imageAspect(
			aspect,
			store.resolution.width,
			store.resolution.height,
		);
		store.aspect.a1 = imgAspect.a1;
		store.aspect.a2 = imgAspect.a2;

		this.scene.add(this.instance);
	}

	/// #if DEBUG
	setDebugCamera() {
		const orbitParams = {
			spherical: {
				radius: 5,
				phi: 1,
				theta: 0.5,
			},

			minDistance: 0.5,
			maxDistance: 20,
		};

		this.debugCam = {};
		this.debugCam.camera = this.instance.clone();
		this.debugCam.camera.rotation.reorder('YXZ');

		this.debugCam.control = new orbitController(this.debugCam.camera, {
			element: this.canvas,
			minDistance: orbitParams.minDistance,
			maxDistance: orbitParams.maxDistance,
		});
		this.debugCam.control.sphericalTarget.set(
			orbitParams.spherical.radius,
			orbitParams.spherical.phi,
			orbitParams.spherical.theta,
		);
	}
	/// #endif

	resize() {
		if (this.instance instanceof PerspectiveCamera) {
			this.instance.aspect = store.aspect.ratio;
			this.instance.updateProjectionMatrix();
		}

		// If you want to keep the aspect of your image in a shader
		const aspect = 1 / 1; // Aspect of the displayed image
		const imgAspect = imageAspect(
			aspect,
			store.resolution.width,
			store.resolution.height,
		);
		store.aspect.a1 = imgAspect.a1;
		store.aspect.a2 = imgAspect.a2;

		/// #if DEBUG
		this.debugCam.camera.aspect = store.aspect.ratio;
		this.debugCam.camera.updateProjectionMatrix();
		/// #endif
	}

	update() {
		if (!initialized) return;
		/// #if DEBUG
		this.debugCam.control.update();

		this.instance.position.copy(this.debugCam.camera.position);
		this.instance.quaternion.copy(this.debugCam.camera.quaternion);
		this.instance.updateMatrixWorld();
		/// #endif
	}

	destroy() {
		/// #if DEBUG
		this.debugCam.control.destroy();
		/// #endif
	}
}
