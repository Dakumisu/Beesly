import { PCFSoftShadowMap, NoToneMapping, LinearToneMapping, sRGBEncoding, WebGLRenderer, ReinhardToneMapping, CineonToneMapping, ACESFilmicToneMapping, Mesh, WebGLRenderTarget, LinearFilter, RGBFormat, WebGLMultisampleRenderTarget } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import Webgl from './Webgl'

import { Store } from '@js/Tools/Store'

export default class Renderer {
	constructor(opt = {}) {
		this.webgl = new Webgl()
		this.scene = this.webgl.scene
		this.camera = this.webgl.camera.pCamera

		/// #if DEBUG
			this.stats = this.webgl.stats
			this.debugFolder = this.webgl.debug.addFolder('renderer')
		/// #endif

		this.usePostprocess = false

		this.setRenderer()
		this.setPostProcess()
	}

	setRenderer() {
		this.clearColor = '#222222'

		this.renderer = new WebGLRenderer({
			canvas: this.webgl.canvas,
			alpha: false,
			antialias: true,
			powerPreference: 'high-performance',
		})

		this.renderer.setSize(Store.resolution.width, Store.resolution.height)
		this.renderer.setPixelRatio(Math.min(Store.resolution.dpr, 2))
		this.renderer.setClearColor(this.clearColor, 1)

		this.renderer.physicallyCorrectLights = true
		// this.renderer.gammaOutPut = true
		this.renderer.outputEncoding = sRGBEncoding
		// this.renderer.shadowMap.type = PCFSoftShadowMap
		// this.renderer.shadowMap.enabled = false
		this.renderer.toneMapping = NoToneMapping
		this.renderer.toneMappingExposure = 1


		/// #if DEBUG
			this.context = this.renderer.getContext()

			if (this.stats) {
				this.stats.setRenderPanel(this.context)
			}

			this.debugFolder
				.addColor(
					this,
					'clearColor'
				)
				.onChange(() => {
					this.renderer.setClearColor(this.clearColor)
				})

			this.debugFolder
				.add(
					this.renderer,
					'toneMapping', {
						'NoToneMapping': NoToneMapping,
						'LinearToneMapping': LinearToneMapping,
						'ReinhardToneMapping': ReinhardToneMapping,
						'CineonToneMapping': CineonToneMapping,
						'ACESFilmicToneMapping': ACESFilmicToneMapping
					}
				)
				.onChange(() => {
					this.scene.traverse((_child) => {
						if (_child instanceof Mesh)
							_child.material.needsUpdate = true
					})
				})

			this.debugFolder
				.add(
					this.renderer,
					'toneMappingExposure'
				)
				.min(0)
				.max(10)
		/// #endif
	}

	setPostProcess() {
		this.postProcess = {}

		this.postProcess.renderPass = new RenderPass(this.scene, this.camera)

		const RenderTargetClass = Store.resolution.dpr >= 2 ? WebGLRenderTarget : WebGLMultisampleRenderTarget

		this.renderTarget = new RenderTargetClass(
			Store.resolution.width,
			Store.resolution.height, {
				generateMipmaps: false,
				minFilter: LinearFilter,
				magFilter: LinearFilter,
				format: RGBFormat,
				encoding: sRGBEncoding
			}
		)
		this.postProcess.composer = new EffectComposer(this.renderer, this.renderTarget)
		this.postProcess.composer.setSize(Store.resolution.width, Store.resolution.height)
		this.postProcess.composer.setPixelRatio(Math.min(Store.resolution.dpr, 2))

		this.postProcess.composer.addPass(this.postProcess.renderPass)
	}

	resize() {
		this.renderer.setSize(Store.resolution.width, Store.resolution.height)
		this.renderer.setPixelRatio(Math.min(Store.resolution.dpr, 2))

		this.postProcess.composer.setSize(Store.resolution.width, Store.resolution.height)
		this.postProcess.composer.setPixelRatio(Math.min(Store.resolution.dpr, 2))
	}

	update() {
		/// #if DEBUG
			if (this.stats) {
				this.stats.beforeRender()
			}
		/// #endif

		this.usePostprocess ? this.postProcess.composer.render() : this.renderer.render(this.scene, this.camera)

		/// #if DEBUG
			if (this.stats) {
				this.stats.afterRender()
			}
		/// #endif
	}

	destroy() {
		this.renderer.renderLists.dispose()
		this.renderer.dispose()
		this.renderTarget.dispose()
		this.postProcess.composer.renderTarget1.dispose()
		this.postProcess.composer.renderTarget2.dispose()
	}
}
