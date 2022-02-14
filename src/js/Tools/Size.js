import EventEmitter from '@js/tools/EventEmitter';

import { store } from '@js/tools/Store';

export default class Size extends EventEmitter {
	constructor() {
		super();

		// Resize event
		window.addEventListener('resize', this.resize.bind(this));
	}

	resize() {
		store.resolution.width = window.innerWidth;
		store.resolution.height = window.innerHeight;
		store.resolution.dpr = window.devicePixelRatio;

		this.trigger('resize');
	}
}
