import { Scene as ThreeScene } from 'three';
import { Pane } from 'tweakpane';

import Views from '@js/Views/Views';

import Raf from '@js/Tools/Raf';
import Sizes from '@js/Tools/Sizes';
import Keyboard from '@js/Tools/Keyboard';
import Stats from '@js/Tools/Stats';
import Device from '@js/Tools/Device';
import Mouse from '@js/Tools/Mouse';
import Raycasters from '@js/Tools/Raycasters';

import Renderer from './Renderer';
import Camera from './Camera';
import World from './World/World';

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
		this.debug = new Pane();
		this.stats = new Stats();
		/// #endif

		this.views = new Views();

		this.raf = new Raf();
		this.scene = new ThreeScene();
		this.camera = new Camera();
		this.renderer = new Renderer();

		this.device = new Device();
		this.sizes = new Sizes();
		this.keyboard = new Keyboard();
		this.mouse = new Mouse();

		this.world = new World();
		this.raycaster = new Raycasters();

		this.sizes.on('resize', () => {
			this.resize();
			this.device.checkDevice();
			/// #if DEBUG
			console.log('Resize spotted 📐');
			/// #endif
		});

		this.keyboard.on('keyPressed', (e) => {
			/// #if DEBUG
			console.log(`Key ${e.toUpperCase()} pressed 🎹`);
			/// #endif
		});

		this.raycaster.on('raycast', (e) => {
			/// #if DEBUG
			// console.log('Raycast something 🔍', e);
			/// #endif
		});

		this.raf.on('raf', () => {
			this.update();
		});

		initialized = true;
	}

	update() {
		if (!initialized) return;

		if (this.camera) this.camera.update();
		if (this.world) this.world.update(this.raf.elapsed);
		if (this.renderer) this.renderer.update();
		if (this.raycaster) this.raycaster.update();

		/// #if DEBUG
		if (this.stats) this.stats.update();
		/// #endif
	}

	resize() {
		if (this.camera) this.camera.resize();
		if (this.world) this.world.resize();
		if (this.renderer) this.renderer.resize();
	}

	destroy() {}
}
