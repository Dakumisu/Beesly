import { AdditiveBlending, Color, DoubleSide, InstancedBufferAttribute, InstancedBufferGeometry, LinearFilter, MathUtils, Mesh, PlaneBufferGeometry, RGBFormat, ShaderMaterial, SphereBufferGeometry, Vector3, VideoTexture } from 'three'

import Webgl from '@js/Webgl/Webgl'

import { Store } from '@js/Tools/Store'

import vertex from '@glsl/particles/vertex.vert'
import fragment from '@glsl/particles/fragment.frag'

const tVec3 = new Vector3()

export default class Particles {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene

		/// #if DEBUG
			this.debugFolder = this.webgl.debug.addFolder('particles')
		/// #endif

		this.particles = {}

		this.count = 2048

		this.initialized = false

		this.init()
		this.resize()
	}

	init() {
		this.setAttributes()
		this.setGeometry()
		this.setMaterial()
		this.setMesh()

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

		this.particles.geometry = new InstancedBufferGeometry()

		this.particles.geometry.index = blueprintParticle.index
		this.particles.geometry.attributes.position = blueprintParticle.attributes.position
		this.particles.geometry.attributes.normal = blueprintParticle.attributes.normal
		this.particles.geometry.attributes.uv = blueprintParticle.attributes.uv

		this.particles.geometry.setAttribute('aPositions', new InstancedBufferAttribute(this.positions, 3, false));
		this.particles.geometry.setAttribute('aOffset', new InstancedBufferAttribute(this.offset, 1, false))
		this.particles.geometry.setAttribute('aRandomScale', new InstancedBufferAttribute(this.randomScale, 1, false))
	}

	setMaterial() {
		this.color = '#ffffff'

		this.particles.material = new ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: new Color(this.color) },
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
					this.particles.material.uniforms.uColor.value = new Color(this.color)
				})
		/// #endif
	}

	setMesh() {
		this.particles.mesh = new Mesh(this.particles.geometry, this.particles.material)
		this.particles.mesh.frustumCulled = false

		this.addObject(this.particles.mesh)
	}

	addObject(object) {
		this.scene.add(object)
	}

	resize() {
		this.particles.material.uniforms.uResolution.value = tVec3.set(Store.resolution.width, Store.resolution.height, Store.resolution.dpr)
	}

	update(et) {
		if (!this.initialized) return

		this.particles.mesh.material.uniforms.uTime.value = et
	}
}
