import { Scene as ThreeScene } from 'three';

import Views from '@js/views/Views';

import Raf from '@js/tools/Raf';
import Size from '@js/tools/Size';
import Keyboard from '@js/tools/Keyboard';
import Device from '@js/tools/Device';
import Mouse from '@js/tools/Mouse';
import Raycasters from '@js/tools/Raycasters';
import PerformanceMonitor from '@js/tools/PerformanceMonitor';

import Renderer from './Renderer';
import Camera from './Camera';
import World from './components/World';

/// #if DEBUG
import Debug from '@js/tools/Debug';
/// #endif

let initialized = false;

export default class Webgl {
	static instance;

	constructor(_canvas) {
		if (Webgl.instance) {
			return Webgl.instance;
		}
		Webgl.instance = this;

		if (!_canvas) {
			console.error(`Missing 'canvas' property 🚫`);
			return;
		}
		this.canvas = _canvas;

		this.init();
	}

	init() {
		/// #if DEBUG
		this.debug = new Debug();
		/// #endif

		this.views = new Views();

		this.raf = new Raf();
		this.scene = new ThreeScene();
		this.camera = new Camera();
		this.renderer = new Renderer();

		this.device = new Device();
		this.size = new Size();
		this.keyboard = new Keyboard();
		this.mouse = new Mouse();
		this.perf = new PerformanceMonitor();

		this.world = new World();
		this.raycaster = new Raycasters();

		this.keyboard.on('key', (e) => {
			/// #if DEBUG
			console.log(`Key ${e} pressed 🎹`);
			/// #endif
		});

		this.raycaster.on('raycast', (e) => {
			/// #if DEBUG
			// console.log('Raycast something 🔍', e);
			/// #endif
		});

		this.device.on('visibility', (visible) => {
			!visible ? this.raf.pause() : this.raf.play();
		});

		this.size.on('resize', () => {
			this.resize();
			this.device.checkDevice();
			/// #if DEBUG
			console.log('Resize spotted 📐');
			/// #endif
		});

		this.raf.on('raf', () => {
			this.render();
			this.update();
		});

		this.perf.everythingLoaded();
		initialized = true;
	}

	render() {
		if (!initialized) return;

		if (this.camera) this.camera.render();
		if (this.world) this.world.update(this.raf.elapsed, this.raf.delta);
		if (this.renderer) this.renderer.render();
	}

	update() {
		if (!initialized) return;

		if (this.raycaster) this.raycaster.update();
		if (this.perf) this.perf.update(this.raf.delta);

		/// #if DEBUG
		this.debug.stats.update();
		/// #endif
	}

	resize() {
		if (this.camera) this.camera.resize();
		if (this.world) this.world.resize();
		if (this.renderer) this.renderer.resize();
	}

	destroy() {}
}
