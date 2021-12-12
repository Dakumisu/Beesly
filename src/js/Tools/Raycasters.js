import { Raycaster, ArrowHelper, Vector3 } from 'three'

import Webgl from '@js/Webgl/Webgl'

export default class Raycasters {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene
		this.mouse = this.webgl.mouse.scene
		this.camera = this.webgl.camera.pCamera

		this.initialized = false

		this.initRaycaster()

		this.helpers = opt.helpers || false
		if (this.helpers) {
			this.pos = opt.pos // raycatser's position (pos: { x: -1, y: 2 })
			this.dir = opt.dir // raycatser's direction (dir: { x: 2, y: -4 })
			this.initHelper()
		}
	}

	initRaycaster() {
		this.raycaster = new Raycaster()
		this.raycaster.setFromCamera( this.mouse, this.camera )
		this.raycaster.params.Points.threshold = .04 // taille du rayon

		this.initialized = true
	}

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

	update() {
		if (!this.initialized) return

		const intersects = this.raycaster.intersectObjects( this.scene.children, true )

		for ( let i = 0; i < intersects.length; i++ ) {
			console.log(intersects[i].object)
		}
	}
}
