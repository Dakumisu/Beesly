import { getGPUTier } from 'detect-gpu';

import Webgl from '@js/Webgl/Webgl';
import { clamp, median } from '@utils/maths';

import testPerf from '@workers/wPerfomance?worker';
import EventEmitter from './EventEmitter';

const qualityList = [
	'POTATO', // VERY LOW
	'TOASTER', // LOW
	'MEDIUM',
	'HIGH',
	'VERY HIGH',
	'G4M3RS', // ULTRA
];
const rangeList = [3500, 2500, 1600, 1300, 1100, 1000];

// ~1300 mcbook i9
// 1000 - 1070 M1

let bootFrames = 60;

const maxPingPong = 2;
const restartDelay = 300;
let nextDelay = restartDelay;
let delay = 0;

const secondsThreshold = 2;
const highThreshold = 58;
const lowThreshold = 52;
const criticalThreshold = 30;
const resetThreshold = 50;

const defaultQuality = localStorage.getItem('quality') || 4;

let fpsCount = 0;
let timer = 0;
let fps = 0;
let averageFps = 0;

const fpsHistory = new Float64Array(secondsThreshold);
let fpsHistoryIndex = 0;

let prevQuality = defaultQuality;

let pingPong = 0;

let needHardReset = false;
let needReset = false;

let bestQuality = 0;

/// #if DEBUG
const debug = {
	instance: null,
	label: 'stats'
}
/// #endif

export default class PerformanceMoniteur extends EventEmitter {
	constructor(opt = {}) {
		super();

		const webgl = new Webgl();
		const device = webgl.device;
		const size = webgl.size;

		this.quality = defaultQuality;
		this.qualityStr = qualityList[this.quality];
		this.fps = 0;

		this.getGPU();

		device.on('visibility', (visible) => {
			if (visible && averageFps <= resetThreshold)
				this.reset(true, restartDelay, true);
		});

		size.on('resize', () => {
			if (averageFps <= resetThreshold) {
				this.reset(true, resetThreshold, true);
				console.log('resize');
			}
		});
		// this.initWorker();
		// setInterval(() => {
		// 	this.initWorker();
		// }, 2000);

		/// #if DEBUG
		const debug.instance = webgl.debug;
		this.debug();
		/// #endif
	}

	/// #if DEBUG
	debug() {
		debug.instance.setFolder(debug.label, 'Stats');
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

		// const preset = gui.exportPreset();
		// console.log(preset);
	}
	/// #endif

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

		if (pingPong < maxPingPong) {
			if (fpsHistoryIndex > fpsHistory.length) this.updateQuality();
		} else if (fps <= resetThreshold) this.reset(true, restartDelay, true);
	}

	updateQuality() {
		let test = 0;
		// if (fpsHistoryIndex > fpsHistory.length) {
		averageFps = median(fpsHistory);
		test = averageFps;
		// }
		// else {
		// 	test = fps;
		// }

		// test = fps;
		let newQuality = this.quality;

		if (test <= criticalThreshold) {
			newQuality -= 2;
		} else if (test < lowThreshold) {
			newQuality -= 1;
		} else if (test > highThreshold) {
			newQuality += 1;
		}

		newQuality = clamp(newQuality, 0, 5);

		if (newQuality === this.quality) {
			pingPong = Math.max(0, pingPong - 0.2);
		} else if (newQuality !== this.quality && newQuality !== prevQuality) {
			pingPong = 0;
		} else if (newQuality === prevQuality) {
			pingPong = pingPong + 1;
		}

		if (pingPong >= maxPingPong) {
			newQuality = Math.min(prevQuality, this.quality);
		}

		prevQuality = this.quality;
		this.quality = newQuality;
		this.qualityStr = qualityList[this.quality];
		localStorage.setItem('quality', this.quality);

		if (prevQuality != this.quality) this.trigger('quality');

		this.reset(true);
	}

	reset(hardReset, delay, resetPingPong) {
		needReset = true;

		needHardReset = needHardReset || hardReset;
		if (resetPingPong) pingPong = 0;
		if (delay) nextDelay = delay;
	}

	hardReset() {
		timer = 0;
		fpsCount = 0;
		if (needHardReset) fpsHistoryIndex = 0;
		delay = nextDelay || restartDelay;
		needReset = needHardReset = false;
		nextDelay = restartDelay;
	}

	update(dt) {
		if (bootFrames > 0) return bootFrames--;

		// if (pingPong >= maxPingPong) return;
		if (needHardReset) this.hardReset();
		if (delay > 0) return (delay -= dt);

		console.log(
			'fps:' + fps,
			'prev qualité:' + prevQuality,
			'new qualité:' + this.quality,
		);

		this.fps = 1000 / dt;

		timer += dt;
		fpsCount++;
		if (timer >= 1000) this.updateFps();
	}
}

/*
- j'ai 6 qualité possibles : [ VERY LOW, LOW, MEDIUM, HIGH, VERY HIGH, ULTRA ]

- à l'init de l'app, je bench rapidement en fonction des vendors gpu pour estimer la qualité utilisable pour le device, entre low et ultra (very low ne peut etre atteint que via les calculs au runtime)

- à chaque frame, j'incrémente un compteur de frame passée

- au bout de 1 sec j'obtient mon nombre de frame par seconde réelle (et non pas estimée depuis un delta time - ils sont peu précis sur safari / firefox)

- je met cette state de fps dans un array

- au bout de 3 secondes, je prend la moyenne des 3 mesures pour obtenir la moyenne de framerate sur les 3 derniere secondes
    - si je suis au dessus de 58fps, j'incrémente la qualité
    - si je suis en dessous de 52fps, je decrémente la qualité
    - si je suis en dessous de 30 fps, je decrémente la qualité de 2 (seuil critique)

- j'ai aussi un compteur de "ping pong", en gros si je commence à osciller toujours entre un qualité N et une qualité N+1
    - au bout de 3 oscillations sucessives entre les deux qualité, je vérouille sur la qualité N (la plus basse)
    - le monitoring de qualité ne reprendra qu'au prochain reset

- j'attend les 10 premieres frame avant de prendre des mesures, le temps que le renderer se stabilise

- le resize genere souvent des chuttes de fps, donc je "reset" les mesures à chaque resize pour éviter de les prendres en comptes

- je reset aussi les mesures à chaque changement de visilité de la fenetre (car le raf s'arrete quand la fenetre est cachée)

- la fonction de reset est accessible afin de la lancer manuellement si besoin (par exemple, je la lance quand le controlleur audio se lance - ça déclenche souvent un freeze sur safari)
*/
