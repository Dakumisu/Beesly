import { OrthographicCamera, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Webgl from './Webgl';

import { Store } from '@js/Tools/Store';
import { imageAspect } from '@utils/maths';

export default class Camera {
	constructor(opt = {}) {
		const webgl = new Webgl();
		this.scene = webgl.scene;
		this.canvas = webgl.canvas;

		this.type = opt.type || 'Perspective';
		this.type == 'Orthographic'
			? this.setOrthographicCamera()
			: this.setPerspectiveCamera();

		/// #if DEBUG
		const debug = webgl.debug;
		this.debug(debug);
		this.setDebugCamera(debug);
		/// #endif
	}

	setPerspectiveCamera() {
		this.camera = new PerspectiveCamera(
			75,
			Store.resolution.width / Store.resolution.height,
			0.1,
			1000,
		);
		this.camera.position.set(2, 3, 3);
		this.camera.lookAt(0, 0, 0);
		this.camera.rotation.reorder('YXZ');

		this.scene.add(this.camera);
	}

	setOrthographicCamera() {
		const frustrumSize = 1;
		this.camera = new OrthographicCamera(
			frustrumSize / -2,
			frustrumSize / 2,
			frustrumSize / 2,
			frustrumSize / -2,
			-1000,
			1000,
		);
		this.camera.position.set(0, 0, 1);

		// If you want to keep the aspect of your image
		const aspect = 1 / 1; // Aspect of the displayed image
		const imgAspect = imageAspect(
			aspect,
			Store.resolution.width,
			Store.resolution.height,
		);
		Store.aspect.a1 = imgAspect.a1;
		Store.aspect.a2 = imgAspect.a2;

		this.scene.add(this.camera);
	}

	/// #if DEBUG
	debug(debug) {}

	setDebugCamera() {
		this.debugCam = {};
		this.debugCam.camera = this.camera.clone();
		this.debugCam.camera.rotation.reorder('YXZ');

		this.debugCam.orbitControls = new OrbitControls(
			this.debugCam.camera,
			this.canvas,
		);
		this.debugCam.orbitControls.enabled = this.debugCam.active;
		this.debugCam.orbitControls.screenSpacePanning = true;
		this.debugCam.orbitControls.enableKeys = false;
		this.debugCam.orbitControls.zoomSpeed = 0.5;
		this.debugCam.orbitControls.enableDamping = true;
		this.debugCam.orbitControls.update();
	}
	/// #endif

	resize() {
		if (this.type == 'Perspective') {
			this.camera.aspect =
				Store.resolution.width / Store.resolution.height;
			this.camera.updateProjectionMatrix();
		}

		// If you want to keep the aspect of your image in a shader
		const aspect = 1 / 1; // Aspect of the displayed image
		const imgAspect = imageAspect(
			aspect,
			Store.resolution.width,
			Store.resolution.height,
		);
		Store.aspect.a1 = imgAspect.a1;
		Store.aspect.a2 = imgAspect.a2;

		/// #if DEBUG
		this.debugCam.camera.aspect =
			Store.resolution.width / Store.resolution.height;
		this.debugCam.camera.updateProjectionMatrix();
		/// #endif
	}

	render() {
		/// #if DEBUG
		this.debugCam.orbitControls.update();

		this.camera.position.copy(this.debugCam.camera.position);
		this.camera.quaternion.copy(this.debugCam.camera.quaternion);
		this.camera.updateMatrixWorld();
		/// #endif
	}

	destroy() {
		/// #if DEBUG
		this.debugCam.orbitControls.destroy();
		/// #endif
	}
}
