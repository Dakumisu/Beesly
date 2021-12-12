import { Color, DoubleSide, Mesh, PlaneBufferGeometry, ShaderMaterial, Vector3 } from 'three'

import Webgl from '@js/Webgl/Webgl'

import loadModel from '@utils/loader/loadGLTF'

import { Store } from '@js/Tools/Store'

import model from '@public/model/test.glb'

export default class Model {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene

		this.initialized = false

		this.init()
	}

	init() {
		this.load()

		this.initialized = true
	}

	load() {
		loadModel(model).then(response => {
			this.model1 = response
			this.scene.add(this.model1)
		})
	}

	addObject(object) {
		this.scene.add(object)
	}


	update(et) {
		if (!this.initialized) return

	}
}
