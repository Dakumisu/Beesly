import signal from 'signal-js';

import Device from '@tools/Device';
import Keyboard from '@tools/Keyboard';
import Mouse from '@tools/Mouse';
import PerformanceMonitor from '@tools/PerformanceMonitor';
import Raf from '@tools/Raf';
import Raycasters from '@tools/Raycasters';
import Size from '@tools/Size';
import Camera from './Camera';
import Renderer from './Renderer';
import Scene from './Scene';
import World from './World/World';

/// #if DEBUG
import Debug from '@tools/Debug';
/// #endif

let initialized = false;

class Webgl {
	static instance;

	constructor(_canvas) {
		if (!_canvas) {
			console.error(`Missing 'canvas' property 🚫`);
			return null;
		}
		this.canvas = _canvas;
		Webgl.instance = this;

		this.init();
		this.event();
	}

	init() {
		/// #if DEBUG
		this.debug = new Debug();
		/// #endif

		this.device = new Device();
		this.size = new Size();

		this.raf = new Raf();
		this.scene = new Scene();
		this.camera = new Camera();
		this.performance = new PerformanceMonitor();
		this.renderer = new Renderer();

		this.keyboard = new Keyboard();
		this.mouse = new Mouse();

		this.world = new World();
		this.raycaster = new Raycasters();

		this.performance.everythingLoaded();
		this.resize();

		initialized = true;
	}

	event() {
		if (!initialized) return;

		signal.on('raycast', (e) => {
			/// #if DEBUG
			// console.log('Raycast something 🔍', e);
			/// #endif
		});

		signal.on('resize', () => {
			this.resize();
			/// #if DEBUG
			console.log('Resize spotted 📐');
			/// #endif
		});

		signal.on('raf', () => {
			this.update();
			this.render();
		});
	}

	render() {
		if (!initialized) return;

		if (this.world) this.world.update(this.raf.elapsed, this.raf.delta);
		if (this.camera) this.camera.render();
		if (this.renderer) this.renderer.render();
	}

	update() {
		if (!initialized) return;

		// if (this.raycaster) this.raycaster.update();
		if (this.performance) this.performance.update(this.raf.delta);

		/// #if DEBUG
		if (this.debug.stats) this.debug.stats.update();
		/// #endif
	}

	resize() {
		if (this.renderer) this.renderer.resize();
		if (this.camera) this.camera.resize();
		if (this.world) this.world.resize();
		if (this.device) this.device.resize();
	}

	destroy() {
		signal.clear();
		/// #if DEBUG
		this.debug.destroy();
		/// #endif
		this.device.destroy();
		this.size.destroy();
		this.raf.destroy();
		this.keyboard.destroy();
		this.raycaster.destroy();
		this.mouse.destroy();
		this.performance.destroy();

		this.scene.destroy();
		this.world.destroy();
		this.renderer.destroy();
		this.camera.destroy();

		delete Webgl.instance;
	}
}

const initWebgl = (canvas) => {
	return new Webgl(canvas);
};

const getWebgl = () => {
	return Webgl.instance;
};

export { initWebgl, getWebgl };
