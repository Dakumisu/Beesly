import Emitter from '@js/Tools/Emitter';

import { store } from '@js/Tools/Store';

let initialized = false;

export default class Nodes extends Emitter {
	constructor() {
		super();

		this.event();

		window.addEventListener('DOMContentLoaded', () => {
			this.getNodes().then(() => {
				initialized = true;
				this.emit('load');
			});
		});

		this.event();
	}

	async getNodes() {
		if (this.elements) return;
		this.ref = [...document.querySelectorAll('[data-ref]')];
		this.elements = {};

		new Promise((resolve) => {
			for (const dom in this.ref) {
				if (this.elements[this.ref[dom].dataset.ref])
					this.elements[this.ref[dom].dataset.ref].push(
						this.ref[dom],
					);
				else this.elements[this.ref[dom].dataset.ref] = [this.ref[dom]];
			}

			resolve();
		});

		return new Promise((resolve) => {
			for (const key in this.elements) {
				if (this.elements[key].length === 1) {
					const tmpValue = this.elements[key][0];
					this.elements[key] = tmpValue;
				}
			}

			resolve();
		});
	}

	generateNodes(json) {
		const docFragment = document.createElement(DocumentFragment);

		document.body.appendChild(docFragment);

		this.destroy();
		this.getNodes();
	}

	destroy() {
		delete this.ref;
		delete this.elements;
	}

	event() {
		if (!initialized) return;
	}
}
