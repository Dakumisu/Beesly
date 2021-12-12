import Webgl from '@js/Webgl/Webgl'

import Blueprint from './Blueprint'
import GeoMerge from './GeoMerge'
import Model from './Model'
import Particles from './Particles'

export default class World {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene

		this.initialized = false

		this.setComponent()
	}

	setComponent() {
		this.blueprint = new Blueprint()
		this.particles = new Particles()
		this.model = new Model()
		this.geoMerge = new GeoMerge()

		this.initialized = true
	}

	add(object) {
		this.scene.add(object)
	}

	resize() {
		if (!this.initialized) return

		if (this.blueprint) this.blueprint.resize()
		if (this.particles) this.particles.resize()
	}

	update(et) {
		if (!this.initialized) return

		if (this.blueprint) this.blueprint.update(et)
		if (this.particles) this.particles.update(et)
	}

	destroy() {

	}
}
