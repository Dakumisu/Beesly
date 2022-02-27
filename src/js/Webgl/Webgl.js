import { Scene as ThreeScene } from 'three';

import Raf from '@js/Tools/Raf';
import Size from '@js/Tools/Size';
import Keyboard from '@js/Tools/Keyboard';
import Device from '@js/Tools/Device';
import Mouse from '@js/Tools/Mouse';
import Raycasters from '@js/Tools/Raycasters';
import PerformanceMonitor from '@js/Tools/PerformanceMonitor';

import Renderer from './Renderer';
import Camera from './Camera';
import World from './Components/World';

/// #if DEBUG
import Debug from '@js/Tools/Debug';
/// #endif

let initialized = false;

export default class Webgl {
	static instance;

	constructor(_canvas) {
		if (Webgl.instance) {
			return Webgl.instance;
		}
		Webgl.instance = this;

		if (!_canvas) return console.error(`Missing 'canvas' property 🚫`);
		this.canvas = _canvas;

		this.init();
	}

	init() {
		/// #if DEBUG
		this.debug = new Debug();
		/// #endif

		this.device = new Device();
		this.size = new Size();

		this.raf = new Raf();
		this.scene = new ThreeScene();
		this.camera = new Camera();
		this.performance = new PerformanceMonitor();
		this.renderer = new Renderer();

		this.keyboard = new Keyboard();
		this.mouse = new Mouse();

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
			/// #if DEBUG
			console.log('Resize spotted 📐');
			/// #endif
		});

		this.raf.on('raf', () => {
			this.update();
			this.render();
		});

		this.performance.everythingLoaded();
		this.resize();
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
		if (this.performance) this.performance.update(this.raf.delta);

		/// #if DEBUG
		if (this.debug) this.debug.stats.update();
		/// #endif
	}

	resize() {
		if (this.renderer) this.renderer.resize();
		if (this.camera) this.camera.resize();
		if (this.world) this.world.resize();
		if (this.device) this.device.resize();
	}

	destroy() {
		/// #if DEBUG
		this.debug.destroy();
		/// #endif
		this.device.destroy();
		this.size.destroy();
		this.raf.destroy();
		this.keyboard.destroy();
		this.mouse.destroy();
		this.world.destroy();

		delete this;
	}
}
