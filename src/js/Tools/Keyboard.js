import Emitter from '@tools/Emitter';

export default class Keyboard extends Emitter {
	constructor() {
		super();

		document.addEventListener('keydown', this.getKey.bind(this));
	}

	getKey(e) {
		const key = (e.key != ' ' ? e.key : e.code).toUpperCase();

		this.emit('key', [key]);
	}

	destroy() {
		this.off('key');
		document.removeEventListener('keydown', this.getKey.bind(this));
	}
}
