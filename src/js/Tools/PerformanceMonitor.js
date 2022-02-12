import { getGPUTier } from 'detect-gpu';

import Webgl from '@js/Webgl/Webgl';
import EventEmitter from './EventEmitter';

import { store } from './Store';
import { clamp, median } from '@utils/maths';

import testPerf from '@workers/wPerfomance?worker';

const qualityList = [
	'POTATO', // VERY LOW
	'TOASTER', // LOW
	'MEDIUM',
	'HIGH',
	'VERY HIGH',
	'G4M3RS', // ULTRA
];
const rangeList = [3500, 2500, 1600, 1300, 1100, 1000];

let bootFrames = 10;

const MAX_PING_PONG = 2;
const RESTART_DELAY = 300;
let nextDelay = RESTART_DELAY;
let delay = 0;

const SECONDS_THRESHOLD = 2;
const HIGH_THRESHOLD = 58;
const LOW_THRESHOLD = 54;
const CRITICAL_THRESHOLD = 30;
const RESET_THRESHOLD = 50;

const DEFAULT_QUALITY = localStorage.getItem('quality') || 4;

let fpsCount = 0;
let fps = 0;
let averageFps = 0;
let timer = 0;

const fpsHistory = new Float64Array(SECONDS_THRESHOLD);
let fpsHistoryIndex = 0;

let prevQuality = -1;

let pingPong = 0;

let needHardReset = false;
let needReset = false;

let initialized = false;

/// #if DEBUG
const debug = {
	instance: null,
	label: 'stats',
	title: 'Stats',
};
/// #endif

export default class PerformanceMoniteur extends EventEmitter {
	constructor(opt = {}) {
		super();

		const webgl = new Webgl();
		const device = webgl.device;
		const size = webgl.size;

		this.quality = DEFAULT_QUALITY;

		this.qualityStr = qualityList[this.quality];
		this.fps = 0;

		if (!localStorage.getItem('quality')) this.getGPU();

		// store.browser == 'Safari' ? this.initWorker() : this.getGPU();

		device.on('visibility', (visible) => {
			if (initialized && visible && averageFps <= RESET_THRESHOLD)
				this.reset(true, RESTART_DELAY, true);
		});

		size.on('resize', () => {
			if (initialized && averageFps <= RESET_THRESHOLD) {
				this.reset(true, RESET_THRESHOLD, true);
			}
		});

		/// #if DEBUG
		debug.instance = webgl.debug;
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		debug.instance.setFolder(debug.label, debug.title);
		const gui = debug.instance.getFolder(debug.label);

		gui.addMonitor(this, 'fps', {
			lineCount: 1,
		});
		gui.addMonitor(
			this,
			'qualityStr',
			{ label: 'quality' },
			{
				lineCount: 1,
			},
		);
	}
	/// #endif

	everythingLoaded() {
		initialized = true;
		this.trigger('quality');
	}

	initWorker() {
		const worker = testPerf();

		worker.postMessage({
			start: true,
		});

		worker.addEventListener('message', (response) => {
			let gapTime = response.data;
			this.getQuality(gapTime);

			worker.terminate();
		});
	}

	getQuality(data) {
		let result = 0;
		rangeList.forEach((range, i) => {
			if (data <= range) result = i;
		});

		this.quality = result;
		this.qualityStr = qualityList[this.quality];

		console.log(data, this.quality);
	}

	async getGPU() {
		const gpuTier = await getGPUTier();

		this.quality = gpuTier.tier * 2 - 1;
		this.qualityStr = qualityList[this.quality];
		localStorage.setItem('quality', this.quality);

		console.log(this.quality, gpuTier);

		this.trigger('quality');

		// Example output:
		// {
		//   "tier": 1,
		//   "isMobile": false,
		//   "type": "BENCHMARK",
		//   "fps": 21,
		//   "gpu": "intel iris graphics 6100"
		// }
	}

	updateFps() {
		fpsHistory[fpsHistoryIndex++] = fpsCount;
		fps = fpsCount;

		// Reset fps measure
		fpsCount = 0;
		timer = timer % 1000;

		console.log(fps);

		if (!localStorage.getItem('quality')) {
			if (pingPong < MAX_PING_PONG) {
				if (fpsHistoryIndex > fpsHistory.length) this.updateQuality();
			}
		}

		if (localStorage.getItem('quality') && fps <= RESET_THRESHOLD)
			this.reset(true, RESTART_DELAY, true);
	}

	updateQuality() {
		averageFps = median(fpsHistory);

		let newQuality = this.quality;

		if (averageFps <= CRITICAL_THRESHOLD) {
			newQuality -= 2;
		} else if (averageFps < LOW_THRESHOLD) {
			newQuality -= 1;
		} else if (averageFps > HIGH_THRESHOLD) {
			newQuality += 1;
		}

		newQuality = clamp(newQuality, 0, qualityList.length - 1);

		if (newQuality === this.quality) {
			pingPong = Math.max(0, pingPong - 0.2);
		} else if (newQuality !== this.quality && newQuality !== prevQuality) {
			pingPong = 0;
		} else if (newQuality === prevQuality) {
			pingPong++;
		}

		if (pingPong >= MAX_PING_PONG) {
			newQuality = Math.min(prevQuality, this.quality);
			localStorage.setItem('quality', newQuality);
		}

		prevQuality = this.quality;
		this.quality = newQuality;
		this.qualityStr = qualityList[this.quality];

		if (prevQuality != this.quality) this.trigger('quality');

		this.reset(true);
	}

	reset(hardReset, delay, resetPingPong) {
		console.log('reset');
		needReset = true;

		localStorage.removeItem('quality');
		needHardReset = needHardReset || hardReset;
		if (resetPingPong) pingPong = 0;
		if (delay) nextDelay = delay;
	}

	hardReset() {
		console.log('hard reset');

		timer = 0;
		fpsCount = 0;
		if (needHardReset) fpsHistoryIndex = 0;
		delay = nextDelay || RESTART_DELAY;
		needReset = needHardReset = false;
		nextDelay = RESTART_DELAY;
	}

	update(dt) {
		this.fps = 1000 / dt;

		if (!initialized) return;
		if (bootFrames > 0) return bootFrames--;

		if (needHardReset) this.hardReset();
		if (delay > 0) return (delay -= dt);

		// console.log(
		// 	'fps:' + fps,
		// 	'prev qualité:' + prevQuality,
		// 	'new qualité:' + this.quality,
		// );

		timer += dt;
		fpsCount++;
		if (timer >= 1000) this.updateFps();
	}
}
