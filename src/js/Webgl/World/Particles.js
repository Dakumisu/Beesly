import { AdditiveBlending, Color, DoubleSide, InstancedBufferAttribute, InstancedBufferGeometry, LinearFilter, MathUtils, Mesh, PlaneBufferGeometry, RGBFormat, ShaderMaterial, SphereBufferGeometry, Vector3, VideoTexture } from 'three'

import Webgl from '@js/Webgl/Webgl'

import { Store } from '@js/Tools/Store'

import vertex from '@glsl/particles/vertex.glsl'
import fragment from '@glsl/particles/fragment.glsl'

const tVec3 = new Vector3()
const tCol = new Color()

/* FBO Particles coming soon */
export default class Particles {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene

		/// #if DEBUG
		this.debugFolder = this.webgl.debug.addFolder('particles')
		/// #endif

		this.object = {}

		this.count = 2048

		this.initialized = false

		this.init()
	}

	init() {
		this.setAttributes()
		this.setGeometry()
		this.setMaterial()
		this.setMesh()

		this.resize()

		this.initialized = true
	}

	setAttributes() {
		const particlesCount = this.count

		this.positions = new Float32Array(particlesCount * 3)
		this.offset = new Float32Array(particlesCount * 1)
		this.randomScale = new Float32Array(particlesCount * 1)

		for (let i = 0; i < particlesCount; i++) {
			this.positions[i * 3 + 0] = MathUtils.randFloatSpread(1)
			this.positions[i * 3 + 1] = MathUtils.randFloatSpread(1)
			this.positions[i * 3 + 2] = MathUtils.randFloatSpread(1)

			this.offset[i + 0] = MathUtils.randFloatSpread(50)
			this.randomScale[i + 0] = MathUtils.randFloat(.5, 1.5)
		}
	}

	setGeometry() {
		const blueprintParticle = new PlaneBufferGeometry()
		blueprintParticle.scale(.01, .01, .01)

		this.object.geometry = new InstancedBufferGeometry()

		this.object.geometry.index = blueprintParticle.index
		this.object.geometry.attributes.position = blueprintParticle.attributes.position
		this.object.geometry.attributes.normal = blueprintParticle.attributes.normal
		this.object.geometry.attributes.uv = blueprintParticle.attributes.uv

		this.object.geometry.setAttribute('aPositions', new InstancedBufferAttribute(this.positions, 3, false));
		this.object.geometry.setAttribute('aOffset', new InstancedBufferAttribute(this.offset, 1, false))
		this.object.geometry.setAttribute('aRandomScale', new InstancedBufferAttribute(this.randomScale, 1, false))
	}

	setMaterial() {
		this.color = '#ffffff'

		this.object.material = new ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: tCol.set(this.color) },
				uAlpha: { value: 1 },
				uResolution: { value: tVec3.set(Store.resolution.width, Store.resolution.height, Store.resolution.dpr) }
			},
			side: DoubleSide,
			transparent: true,

			/* for particles */
			depthTest: true,
			depthWrite: false,
			blending: AdditiveBlending
		})


		/// #if DEBUG
		this.debugFolder
			.addColor(
				this,
				'color'
			)
			.onChange(() => {
				tCol.set(this.color)
			})
		/// #endif
	}

	setMesh() {
		this.object.mesh = new Mesh(this.object.geometry, this.object.material)
		this.object.mesh.frustumCulled = false

		this.addObject(this.object.mesh)
	}

	addObject(object) {
		this.scene.add(object)
	}

	resize() {
		this.object.material.uniforms.uResolution.value = tVec3.set(Store.resolution.width, Store.resolution.height, Store.resolution.dpr)
	}

	update(et) {
		if (!this.initialized) return

		this.object.mesh.material.uniforms.uTime.value = et
	}
}
