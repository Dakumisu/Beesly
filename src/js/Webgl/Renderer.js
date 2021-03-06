import signal from 'philbin-packages/signal';

import { NoToneMapping, sRGBEncoding, WebGLRenderer } from 'three';

import { getWebgl } from './Webgl';

import PostFX from './PostFX/PostFX';

import { store } from '@tools/Store';
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
		const webgl = getWebgl();
		this.scene = webgl.scene.instance;
		this.camera = webgl.camera.instance;
		this.canvas = webgl.canvas;

		signal.on('quality', (quality) => {
			const q = clamp(
				Math.ceil(quality / 2),
				0,
				resolutionList.length - 1,
			);

			if (store.device === 'mobile') return;
			if (resolutionQuality == q) return;
			resolutionQuality = q;

			this.updateSize(resolutionQuality);
		});

		this.setRenderer();
		this.setPostProcess();

		/// #if DEBUG
		debug.instance = webgl.debug;
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		if (debug.instance.stats) {
			this.stats = debug.instance.stats;
			this.context = this.renderer.getContext();
			this.stats.setRenderPanel(this.context);
		}

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
		this.postFX.resize(sizes.width, sizes.height);
	}

	resetSize() {
		this.renderer.setSize(store.resolution.width, store.resolution.height);
		this.postFX.resize(store.resolution.width, store.resolution.height);
	}

	setRenderer() {
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			alpha: false,
			antialias: false,
			powerPreference: 'high-performance',
			premultipliedAlpha: false,
		});

		this.renderer.setSize(store.resolution.width, store.resolution.height);
		this.renderer.setPixelRatio(Math.min(store.resolution.dpr, 2));
		this.renderer.setClearColor(params.clearColor, 1);

		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = sRGBEncoding;
		this.renderer.toneMapping = NoToneMapping;
		this.renderer.toneMappingExposure = 1;
	}

	setPostProcess() {
		this.postFX = new PostFX(this.renderer);
	}

	resize() {
		this.updateSize(resolutionQuality);

		this.renderer.setPixelRatio(Math.min(store.resolution.dpr, 2));
	}

	render() {
		/// #if DEBUG
		if (this.stats) this.stats.beforeRender();
		/// #endif

		this.postFX.render();

		/// #if DEBUG
		if (this.stats) this.stats.afterRender();
		/// #endif
	}

	destroy() {
		this.renderer.renderLists.dispose();
		this.postFX.destroy();
		this.renderer.dispose();
	}
}
