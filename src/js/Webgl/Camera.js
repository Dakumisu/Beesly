import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';
import { orbitController } from '@utils/webgl';

import { getWebgl } from './Webgl';

import { store } from '@tools/Store';
import { imageAspect } from 'philbin-packages/maths';

let initialized = false;

/// #if DEBUG
const debug = {
	instance: null,
	label: 'Camera',
};
/// #endif

export default class Camera {
	constructor(opt = {}) {
		const webgl = getWebgl();
		this.scene = webgl.scene.instance;
		this.canvas = webgl.canvas;

		this.type = opt.type || 'Perspective';

		this.init();

		/// #if DEBUG
		debug.instance = webgl.debug;
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		debug.instance.setFolder(debug.label);
		const gui = debug.instance.getFolder(debug.label);

		gui.addInput(this.orbitParams, 'fps', {
			label: 'mode',
			options: { Default: false, FPS: true },
		}).on('change', (e) => {
			this.debugCam.control.setFPSMode(e.value);
		});

		gui.addButton({
			title: 'Toggle auto rotate',
		}).on('click', () => {
			this.debugCam.control.autoRotate = !this.debugCam.control.autoRotate;
		});
	}
	/// #endif

	init() {
		this.type == 'Orthographic' ? this.setOrthographicCamera() : this.setPerspectiveCamera();

		/// #if DEBUG
		this.setDebugCamera();
		/// #endif

		initialized = true;
	}

	setPerspectiveCamera() {
		this.instance = new PerspectiveCamera(75, store.aspect.ratio, 0.1, 1000);
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
		const imgAspect = imageAspect(aspect, store.resolution.width, store.resolution.height);
		store.aspect.a1 = imgAspect.a1;
		store.aspect.a2 = imgAspect.a2;

		this.scene.add(this.instance);
	}

	/// #if DEBUG
	setDebugCamera() {
		this.orbitParams = {
			spherical: {
				radius: 5,
				phi: 1,
				theta: 0.5,
			},

			minDistance: 0.5,
			maxDistance: 20,

			fps: false,
		};

		this.debugCam = {};
		this.debugCam.camera = this.instance.clone();
		this.debugCam.camera.rotation.reorder('YXZ');

		this.debugCam.control = new orbitController(this.debugCam.camera, {
			minDistance: this.orbitParams.minDistance,
			maxDistance: this.orbitParams.maxDistance,
			useOrbitKeyboard: false,
		});
		this.debugCam.control.sphericalTarget.set(
			this.orbitParams.spherical.radius,
			this.orbitParams.spherical.phi,
			this.orbitParams.spherical.theta,
		);
	}
	/// #endif

	resize() {
		if (this.instance instanceof PerspectiveCamera) {
			this.instance.aspect = store.aspect.ratio;
			this.instance.updateProjectionMatrix();

			/// #if DEBUG
			this.debugCam.camera.aspect = store.aspect.ratio;
			this.debugCam.camera.updateProjectionMatrix();
			/// #endif
		}

		if (this.instance instanceof OrthographicCamera) {
			// If you want to keep the aspect of your image in a shader
			const aspect = 1 / 1; // Aspect of the displayed image
			const imgAspect = imageAspect(aspect, store.resolution.width, store.resolution.height);
			store.aspect.a1 = imgAspect.a1;
			store.aspect.a2 = imgAspect.a2;
		}
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
