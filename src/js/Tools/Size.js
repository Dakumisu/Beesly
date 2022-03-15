import signal from 'philbin-packages/signal';

import { store } from '@tools/Store';

export default class Size {
	constructor() {
		window.addEventListener('resize', this.resize.bind(this));
		this.resize();
	}

	resize() {
		store.resolution.width = window.innerWidth;
		store.resolution.height = window.innerHeight;
		store.resolution.dpr = window.devicePixelRatio;
		store.aspect.ratio = store.resolution.width / store.resolution.height;

		signal.emit('resize');
	}

	destroy() {
		window.removeEventListener('resize', this.resize.bind(this));
	}
}
