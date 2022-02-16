import Emitter from '@js/Tools/Emitter';

import { store } from '@js/Tools/Store';

export default class Size extends Emitter {
	constructor() {
		super();

		// Resize event
		window.addEventListener('resize', this.resize.bind(this));
	}

	resize() {
		store.resolution.width = window.innerWidth;
		store.resolution.height = window.innerHeight;
		store.resolution.dpr = window.devicePixelRatio;

		this.emit('resize');
	}
}
