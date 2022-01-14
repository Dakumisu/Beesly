import { Raycaster, ArrowHelper, Vector3 } from 'three'

import EventEmitter from './EventEmitter'
import Webgl from '@js/Webgl/Webgl'

export default class Raycasters extends EventEmitter {
	constructor(opt = {}) {
		super()

		this.webgl = new Webgl()
		this.scene = this.webgl.scene
		this.mouse = this.webgl.mouse.scene
		this.camera = this.webgl.camera.pCamera

		this.initialized = false

		this.initRaycaster()

		/// #if DEBUG
		this.helpers = opt.helpers || false
		if (this.helpers) {
			this.pos = opt.pos // raycatser's position (pos: { x: -1, y: 2 })
			this.dir = opt.dir // raycatser's direction (dir: { x: 2, y: -4 })
			this.initHelper()
		}
		/// #endif
	}

	initRaycaster() {
		this.raycaster = new Raycaster()
		this.raycaster.params.Points.threshold = .01 // ray' size

		this.initialized = true
	}

	/// #if DEBUG
	initHelper() {
		this.rayOrigin = new Vector3(this.pos.x, this.pos.y, 0)
		this.rayDirection = new Vector3(this.dir.x, this.dir.y, 0)
		this.rayDirection.normalize()

		this.raycaster.set(this.rayOrigin, this.rayDirection)

		this.length = 10
		this.color = 0xffffff

		this.arrowHelper = new ArrowHelper(this.rayDirection, this.rayOrigin, this.length, this.color)
		this.scene.add(this.arrowHelper)
	}
	/// #endif


	update() {
		if (!this.initialized) return

		this.raycaster.setFromCamera( this.mouse, this.camera )
		const intersects = this.raycaster.intersectObjects( this.scene.children, false )

		for ( let i = 0; i < intersects.length; i++ ) {
			this.trigger('raycast', [intersects[i].object])
			/// #if DEBUG
			// console.log(intersects[i].object)
			/// #endif
		}
	}
}
