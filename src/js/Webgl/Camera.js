import { OrthographicCamera, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Webgl from './Webgl'

import { Store } from '@js/Tools/Store'
import { imageAspect } from '@utils/maths'

export default class Camera {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene

		this.type = opt.type

		this.setPerspectiveCamera()
		// this.setOrthographicCamera()

		/// #if DEBUG
			this.setDebugCamera()
		/// #endif
	}

	setPerspectiveCamera() {
		this.pCamera = new PerspectiveCamera(75, Store.resolution.width / Store.resolution.height, 0.01, 1000)
		this.pCamera.position.set(0, 0, 3)
		this.pCamera.rotation.reorder('YXZ')

		this.scene.add(this.pCamera)
	}

	setOrthographicCamera() {
		const frustrumSize = 1
		this.oCamera = new OrthographicCamera(frustrumSize / -2, frustrumSize / 2, frustrumSize / 2, frustrumSize / -2, -1000, 1000)
		this.oCamera.position.set(0, 0, 1)

		// If you want to keep the aspect of your image
		const aspect = 1 / 1 // Aspect of the displayed image
		const imgAspect = imageAspect(aspect, Store.resolution.width, Store.resolution.height)
		Store.resolution.a1 = imgAspect.a1
		Store.resolution.a2 = imgAspect.a2

		this.scene.add(this.oCamera)
	}

	setDebugCamera() {
		this.debug = {}
		this.debug.camera = this.pCamera.clone()
		this.debug.camera.rotation.reorder('YXZ')

		this.debug.orbitControls = new OrbitControls(this.debug.camera, this.webgl.canvas)
		this.debug.orbitControls.enabled = this.debug.active
		this.debug.orbitControls.screenSpacePanning = true
		this.debug.orbitControls.enableKeys = false
		this.debug.orbitControls.zoomSpeed = 0.5
		this.debug.orbitControls.enableDamping = true
		this.debug.orbitControls.update()
	}


	resize() {
		this.pCamera.aspect = Store.resolution.width / Store.resolution.height
		this.pCamera.updateProjectionMatrix()

		// If you want to keep the aspect of your image
		const aspect = 1 / 1 // Aspect of the displayed image
		const imgAspect = imageAspect(aspect, Store.resolution.width, Store.resolution.height)
		Store.resolution.a1 = imgAspect.a1
		Store.resolution.a2 = imgAspect.a2

		/// #if DEBUG
			this.debug.camera.aspect = Store.resolution.width / Store.resolution.height
			this.debug.camera.updateProjectionMatrix()
		/// #endif
	}

	update() {
		/// #if DEBUG
			this.debug.orbitControls.update()

			this.pCamera.position.copy(this.debug.camera.position)
			this.pCamera.quaternion.copy(this.debug.camera.quaternion)
			this.pCamera.updateMatrixWorld()
		/// #endif
	}

	destroy() {
		/// #if DEBUG
			this.debug.orbitControls.destroy()
		/// #endif
	}
}
