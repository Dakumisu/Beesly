/*
	Credits @pqml (https://github.com/pqml) 🔥
*/

import { getGPUTier } from 'detect-gpu';

import Webgl from '@js/Webgl/Webgl';
import Emitter from './Emitter';

import { store } from './Store';
import { clamp, median } from 'philbin-packages/maths';

const qualityList = [
	'POTATO', // VERY LOW
	'TOASTER', // LOW
	'MEDIUM',
	'HIGH',
	'VERY HIGH',
	'G4M3RS', // ULTRA
];

let bootFrames = 60;

const MAX_PING_PONG = 2;
const MAX_PREVAULT_PING_PONG = MAX_PING_PONG;
const RESTART_DELAY = 300;
let nextDelay = RESTART_DELAY;
let delay = 0;

const SECONDS_THRESHOLD = 2;
const HIGH_THRESHOLD = 58;
const LOW_THRESHOLD = 54;
const CRITICAL_THRESHOLD = 30;
const RESET_THRESHOLD = 50;

const DEFAULT_QUALITY = localStorage.getItem('quality')
	? JSON.parse(localStorage.getItem('quality'))
	: 3;

let fpsCount = 0;
let averageFps = 0;
let timer = 0;

const fpsHistory = new Float64Array(SECONDS_THRESHOLD);
let fpsHistoryIndex = 0;

let prevQuality = null;
let bestQuality = null;

let pingPong = 0;
let prevaultInfinitePingPong = 0;

let needHardReset = false;
let needReset = false;

let initialized = false;

/// #if DEBUG
const debug = {
	instance: null,
	label: 'Perfomances',
	tab: 'Stats',
};
/// #endif

export default class PerfomanceMonitor extends Emitter {
	constructor() {
		super();

		const webgl = new Webgl();
		const device = webgl.device;
		const size = webgl.size;

		this.quality = DEFAULT_QUALITY;

		this.qualityStr = qualityList[this.quality];
		this.fps = 0;

		if (!localStorage.getItem('quality')) this.getGPU();

		device.on('visibility', (visible) => {
			if (visible) fpsHistoryIndex = 0;
		});

		size.on('resize', () => {
			fpsHistoryIndex = 0;
		});

		this.udpateActive = localStorage.getItem('updateQuality')
			? JSON.parse(localStorage.getItem('updateQuality'))
			: true;

		/// #if DEBUG
		debug.instance = webgl.debug;
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		debug.instance.setFolder(debug.label, debug.tab);
		const gui = debug.instance.getFolder(debug.label);

		gui.addMonitor(this, 'fps', { type: 'graph' });
		gui.addMonitor(this, 'qualityStr', { label: 'quality' });

		gui.addSeparator();

		gui.addButton({
			title: 'Hard Reset',
		}).on('click', () => {
			this.reset(true, RESTART_DELAY, true);
		});

		gui.addButton({
			title: 'Toggle Update',
		}).on('click', () => {
			this.udpateActive = !this.udpateActive;
			localStorage.setItem('updateQuality', this.udpateActive);
		});

		gui.addSeparator();

		gui.addMonitor(this, 'udpateActive', { label: 'Update Active' });

		gui.addInput(this, 'quality', {
			label: 'Debug Quality',
			min: 0,
			max: qualityList.length - 1,
			step: 1,
		}).on('change', (e) => {
			if (e.last) {
				this.qualityStr = qualityList[this.quality];
				localStorage.setItem('quality', this.quality);
				this.emit('quality', [this.quality]);
			}
		});
	}
	/// #endif

	everythingLoaded() {
		initialized = true;
		this.emit('quality', [this.quality]);
	}

	async getGPU() {
		const gpuTier = await getGPUTier();

		const qualityResult = gpuTier.tier * 2 - 1;

		this.quality = Math.max(this.quality, qualityResult);
		this.qualityStr = qualityList[this.quality];
		localStorage.setItem('quality', this.quality);

		this.emit('quality', [this.quality]);
	}

	updateFps() {
		fpsHistory[fpsHistoryIndex++] = fpsCount;
		fpsHistoryIndex = fpsHistoryIndex % 4;

		averageFps = median(fpsHistory);

		this.fps = fpsCount;
		fpsCount = 0;
		timer = timer % 1000;

		if (!this.udpateActive) return;
		if (!localStorage.getItem('quality')) {
			if (
				pingPong < MAX_PING_PONG &&
				prevaultInfinitePingPong < MAX_PREVAULT_PING_PONG
			) {
				if (fpsHistoryIndex > fpsHistory.length) this.updateQuality();
			}
		} else if (
			fpsHistoryIndex > fpsHistory.length &&
			averageFps <= RESET_THRESHOLD
		) {
			this.updateQuality();
			this.reset(true, RESTART_DELAY, true);
		}
	}

	updateQuality() {
		let newQuality = this.quality;

		if (averageFps <= CRITICAL_THRESHOLD) {
			bestQuality = prevQuality;
			prevaultInfinitePingPong++;
			newQuality -= 2;
		} else if (averageFps < LOW_THRESHOLD) {
			newQuality -= 1;
		} else if (averageFps > HIGH_THRESHOLD) {
			newQuality += 1;
		}

		newQuality = clamp(newQuality, 0, qualityList.length - 1);

		if (newQuality === this.quality) {
			pingPong = Math.max(0, pingPong - 0.2);
			prevaultInfinitePingPong++;
			bestQuality = this.quality;
		} else if (newQuality !== this.quality && newQuality !== prevQuality) {
			pingPong = 0;
		} else if (newQuality === prevQuality) {
			pingPong++;
			prevaultInfinitePingPong = 0;
		}

		if (pingPong >= MAX_PING_PONG) {
			bestQuality = newQuality;
			newQuality = Math.min(prevQuality, this.quality);
			localStorage.setItem('quality', newQuality);
		}

		prevQuality = this.quality;

		if (prevaultInfinitePingPong >= MAX_PREVAULT_PING_PONG) {
			this.quality = bestQuality;
			localStorage.setItem('quality', this.quality);
		} else {
			this.quality = newQuality;
		}

		this.qualityStr = qualityList[this.quality];

		if (prevQuality != this.quality) this.emit('quality', [this.quality]);

		if (pingPong < MAX_PING_PONG) this.reset();
	}

	reset(hardReset, delay, resetPingPong) {
		needReset = true;

		timer = 0;
		fpsCount = 0;

		needHardReset = needHardReset || hardReset;
		if (resetPingPong) pingPong = 0;
		if (delay) nextDelay = delay;
	}

	hardReset() {
		localStorage.removeItem('quality');
		prevaultInfinitePingPong = 0;
		if (needHardReset) fpsHistoryIndex = 0;
		delay = nextDelay || RESTART_DELAY;
		needReset = needHardReset = false;
		nextDelay = RESTART_DELAY;
	}

	update(dt) {
		if (!initialized) return;
		if (bootFrames > 0) return bootFrames--;

		if (needHardReset) this.hardReset();
		if (delay > 0) return (delay -= dt);

		timer += dt;
		fpsCount++;
		if (timer >= 1000) this.updateFps();
	}
}
