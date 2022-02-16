import Emitter from '@js/Tools/Emitter';

export default class Keyboard extends Emitter {
	constructor() {
		super();

		// keydown event
		window.addEventListener('keydown', this.getKey.bind(this));
	}

	getKey(e) {
		const key = (e.key != ' ' ? e.key : e.code).toUpperCase();

		this.emit('key', [key]);
	}
}
