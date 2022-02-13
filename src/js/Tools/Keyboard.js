import EventEmitter from '@js/Tools/EventEmitter';

export default class Keyboard extends EventEmitter {
	constructor() {
		super();

		// keydown event
		window.addEventListener('keydown', this.getKey.bind(this));
	}

	getKey(e) {
		const key = (e.key != ' ' ? e.key : e.code).toUpperCase();

		this.trigger('key', [key]);
	}
}
