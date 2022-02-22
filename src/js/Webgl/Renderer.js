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

import { store } from '@js/Tools/Store';
import { clamp } from 'philbin-packages/maths';

const params = {
	clearColor: '#151515',
};

const resolutionList = [
	720, // 1280×720
	1080, // 1920×1080
	1440, // 2560×1440
	2160, // 3840x2160
];

let resolutionQuality = localStorage.getItem('quality')
	? JSON.parse(localStorage.getItem('quality'))
	: 2;

/// #if DEBUG
const debug = {
	instance: null,
	label: 'Renderer',
};
/// #endif

export default class Renderer {
	constructor(opt = {}) {
		const webgl = new Webgl();
		const performance = webgl.performance;
		this.scene = webgl.scene;
		this.camera = webgl.camera.camera;
		this.canvas = webgl.canvas;

		performance.on('quality', (quality) => {
			const q = clamp(
				Math.ceil(quality / 2),
				0,
				resolutionList.length - 1,
			);
			if (resolutionQuality == q) return;
			resolutionQuality = q;

			this.updateSize(resolutionQuality);
		});

		this.usePostprocess = false;

		this.setRenderer();
		this.setPostProcess();

		/// #if DEBUG
		debug.instance = webgl.debug;
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		this.stats = debug.instance.stats;
		this.context = this.renderer.getContext();
		this.stats.setRenderPanel(this.context);

		debug.instance.setFolder(debug.label);
		const gui = debug.instance.getFolder(debug.label);

		gui.addInput(params, 'clearColor', { label: 'background color' }).on(
			'change',
			(color) => {
				this.renderer.setClearColor(color.value);
			},
		);
	}
	/// #endif

	updateSize(quality) {
		const sizes = {
			width: Math.min(
				store.resolution.width,
				resolutionList[quality] * store.aspect.ratio,
			),
			height: Math.min(store.resolution.height, resolutionList[quality]),
		};

		this.renderer.setSize(sizes.width, sizes.height);
		this.postProcess.composer.setSize(sizes.width, sizes.height);
	}

	resetSize() {
		this.renderer.setSize(store.resolution.width, store.resolution.height);
		this.postProcess.composer.setSize(
			store.resolution.width,
			store.resolution.height,
		);
	}

	setRenderer() {
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			alpha: false,
			antialias: true,
			powerPreference: 'high-performance',
			premultipliedAlpha: false,
		});

		this.renderer.setSize(store.resolution.width, store.resolution.height);
		this.renderer.setPixelRatio(Math.min(store.resolution.dpr, 2));
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
			store.resolution.dpr >= 2
				? WebGLRenderTarget
				: WebGLMultisampleRenderTarget;

		this.renderTarget = new RenderTargetClass(
			store.resolution.width,
			store.resolution.height,
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
			store.resolution.width,
			store.resolution.height,
		);
		this.postProcess.composer.setPixelRatio(
			Math.min(store.resolution.dpr, 2),
		);

		this.postProcess.composer.addPass(this.postProcess.renderPass);
	}

	resize() {
		this.updateSize(resolutionQuality);

		this.renderer.setPixelRatio(Math.min(store.resolution.dpr, 2));

		this.postProcess.composer.setPixelRatio(
			Math.min(store.resolution.dpr, 2),
		);
	}

	render() {
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
