import signal from 'philbin-packages/signal';

export default class Keyboard {
	constructor() {
		document.addEventListener('keydown', this.getKeyDown.bind(this));
		document.addEventListener('keyup', this.getKeyUp.bind(this));
	}

	getKeyDown(e) {
		const key = (e.key != ' ' ? e.key : e.code).toUpperCase();

		signal.emit('keydown', key);
	}

	getKeyUp(e) {
		const key = (e.key != ' ' ? e.key : e.code).toUpperCase();

		signal.emit('keyup', key);
	}

	destroy() {
		document.removeEventListener('keydown', this.getKeyDown.bind(this));
		document.removeEventListener('keyup', this.getKeyUp.bind(this));
	}
}
