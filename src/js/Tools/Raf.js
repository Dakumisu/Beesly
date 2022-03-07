import Emitter from '@tools/Emitter.js';

export default class Raf extends Emitter {
	constructor() {
		super();

		this.start = Date.now();
		this.current = this.start;
		this.elapsed = 0;
		this.delta = 16;
		this.playing = true;

		this.raf();
	}

	play() {
		this.playing = true;
	}

	pause() {
		this.playing = false;
	}

	raf() {
		this._raf = window.requestAnimationFrame(this.raf.bind(this));

		const current = Date.now();

		this.delta = current - this.current;

		this.elapsed += this.playing ? this.delta : 0;
		this.current = current;

		if (this.delta > 60) this.delta = 60;

		if (this.playing) this.emit('raf');
	}

	destroy() {
		this.off('raf');
		window.cancelAnimationFrame(this._raf);
	}
}
