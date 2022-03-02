import Emitter from '@js/Tools/Emitter';

import { store } from '@js/Tools/Store';

export default class Size extends Emitter {
	constructor() {
		super();

		window.addEventListener('resize', this.resize.bind(this));
		this.resize();
	}

	resize() {
		store.resolution.width = window.innerWidth;
		store.resolution.height = window.innerHeight;
		store.resolution.dpr = window.devicePixelRatio;
		store.aspect.ratio = store.resolution.width / store.resolution.height;

		this.emit('resize');
	}

	destroy() {
		this.resolveName('resize');
		window.removeEventListener('resize', this.resize.bind(this));
	}
}
