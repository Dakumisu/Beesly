import { Color, DoubleSide, Mesh, PlaneBufferGeometry, ShaderMaterial, Vector3 } from 'three'

import Webgl from '@js/Webgl/Webgl'

import { Store } from '@js/Tools/Store'

import vertex from '@glsl/blueprint/vertex.vert'
import fragment from '@glsl/blueprint/fragment.frag'

const twoPI = Math.PI * 2
const tVec3 = new Vector3()

export default class Blueprint {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene

		this.blueprint = {}

		this.initialized = false

		this.init()
		this.resize()
	}

	init() {
		this.setGeometry()
		this.setMaterial()
		this.setMesh()

		this.initialized = true
	}

	setGeometry() {
		this.blueprint.geometry = new PlaneBufferGeometry(1, 1, 1, 1)
	}

	setMaterial() {
		this.blueprint.material = new ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: new Color('#ffffff') },
				uAlpha: { value: 1 },
				uResolution: { value: tVec3.set(Store.resolution.width, Store.resolution.height, Store.resolution.dpr) },
			},
			side: DoubleSide,
			transparent: true
		})
	}

	setMesh() {
		this.blueprint.mesh = new Mesh(this.blueprint.geometry, this.blueprint.material)
		this.blueprint.mesh.frustumCulled = false

		this.addObject(this.blueprint.mesh)
	}

	addObject(object) {
		this.scene.add(object)
	}

	resize() {
		this.blueprint.material.uniforms.uResolution.value = tVec3.set(Store.resolution.width, Store.resolution.height, Store.resolution.dpr)
	}

	update(et) {
		if (!this.initialized) return

		this.blueprint.material.uniforms.uTime.value = et
	}
}
