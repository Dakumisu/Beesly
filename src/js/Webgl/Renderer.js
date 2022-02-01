import {
	PCFSoftShadowMap,
	NoToneMapping,
	LinearToneMapping,
	sRGBEncoding,
	WebGLRenderer,
	ReinhardToneMapping,
	CineonToneMapping,
	ACESFilmicToneMapping,
	Mesh,
	WebGLRenderTarget,
	LinearFilter,
	RGBFormat,
	WebGLMultisampleRenderTarget,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import Webgl from './Webgl';

import { Store } from '@js/Tools/Store';

const params = {
	clearColor: '#222222',
};

export default class Renderer {
	constructor(opt = {}) {
		this.webgl = new Webgl();
		this.scene = this.webgl.scene;
		this.camera = this.webgl.camera.camera;

		this.usePostprocess = false;

		this.setRenderer();
		this.setPostProcess();

		/// #if DEBUG
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		this.stats = this.webgl.stats;
		this.debugFolder = this.webgl.debug.addFolder({
			title: 'Renderer',
			expanded: true,
		});

		this.context = this.renderer.getContext();

		this.stats.setRenderPanel(this.context);

		this.debugFolder
			.addInput(params, 'clearColor', { label: 'background color' })
			.on('change', (color) => {
				this.renderer.setClearColor(color.value);
			});
	}
	/// #endif

	setRenderer() {
		this.renderer = new WebGLRenderer({
			canvas: this.webgl.canvas,
			alpha: false,
			antialias: true,
			powerPreference: 'high-performance',
		});

		this.renderer.setSize(Store.resolution.width, Store.resolution.height);
		this.renderer.setPixelRatio(Math.min(Store.resolution.dpr, 2));
		this.renderer.setClearColor(params.clearColor, 1);

		this.renderer.physicallyCorrectLights = true;
		// this.renderer.gammaOutPut = true
		this.renderer.outputEncoding = sRGBEncoding;
		// this.renderer.shadowMap.type = PCFSoftShadowMap
		// this.renderer.shadowMap.enabled = false
		this.renderer.toneMapping = NoToneMapping;
		this.renderer.toneMappingExposure = 1;
	}

	setPostProcess() {
		this.postProcess = {};

		this.postProcess.renderPass = new RenderPass(this.scene, this.camera);

		const RenderTargetClass =
			Store.resolution.dpr >= 2
				? WebGLRenderTarget
				: WebGLMultisampleRenderTarget;

		this.renderTarget = new RenderTargetClass(
			Store.resolution.width,
			Store.resolution.height,
			{
				generateMipmaps: false,
				minFilter: LinearFilter,
				magFilter: LinearFilter,
				format: RGBFormat,
				encoding: sRGBEncoding,
			},
		);
		this.postProcess.composer = new EffectComposer(
			this.renderer,
			this.renderTarget,
		);
		this.postProcess.composer.setSize(
			Store.resolution.width,
			Store.resolution.height,
		);
		this.postProcess.composer.setPixelRatio(
			Math.min(Store.resolution.dpr, 2),
		);

		this.postProcess.composer.addPass(this.postProcess.renderPass);
	}

	resize() {
		this.renderer.setSize(Store.resolution.width, Store.resolution.height);
		this.renderer.setPixelRatio(Math.min(Store.resolution.dpr, 2));

		this.postProcess.composer.setSize(
			Store.resolution.width,
			Store.resolution.height,
		);
		this.postProcess.composer.setPixelRatio(
			Math.min(Store.resolution.dpr, 2),
		);
	}

	update() {
		/// #if DEBUG
		this.stats.beforeRender();
		/// #endif

		this.usePostprocess
			? this.postProcess.composer.render()
			: this.renderer.render(this.scene, this.camera);

		/// #if DEBUG
		this.stats.afterRender();
		/// #endif
	}

	destroy() {
		this.renderer.renderLists.dispose();
		this.renderer.dispose();
		this.renderTarget.dispose();
		this.postProcess.composer.renderTarget1.dispose();
		this.postProcess.composer.renderTarget2.dispose();
	}
}
