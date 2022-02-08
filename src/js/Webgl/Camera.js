import { OrthographicCamera, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Webgl from './Webgl';

import { Store } from '@js/Tools/Store';
import { imageAspect } from '@utils/maths';

export default class Camera {
	constructor(opt = {}) {
		this.webgl = new Webgl();
		this.scene = this.webgl.scene;

		this.type = opt.type || 'Perspective';
		this.type == 'Orthographic'
			? this.setOrthographicCamera()
			: this.setPerspectiveCamera();

		/// #if DEBUG
		this.setDebugCamera();
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
	setDebugCamera() {
		this.debug = {};
		this.debug.camera = this.camera.clone();
		this.debug.camera.rotation.reorder('YXZ');

		this.debug.orbitControls = new OrbitControls(
			this.debug.camera,
			this.webgl.canvas,
		);
		this.debug.orbitControls.enabled = this.debug.active;
		this.debug.orbitControls.screenSpacePanning = true;
		this.debug.orbitControls.enableKeys = false;
		this.debug.orbitControls.zoomSpeed = 0.5;
		this.debug.orbitControls.enableDamping = true;
		this.debug.orbitControls.update();
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
		this.debug.camera.aspect =
			Store.resolution.width / Store.resolution.height;
		this.debug.camera.updateProjectionMatrix();
		/// #endif
	}

	render() {
		/// #if DEBUG
		this.debug.orbitControls.update();

		this.camera.position.copy(this.debug.camera.position);
		this.camera.quaternion.copy(this.debug.camera.quaternion);
		this.camera.updateMatrixWorld();
		/// #endif
	}

	/// #if DEBUG
	destroy() {
		this.debug.orbitControls.destroy();
	}
	/// #endif
}
