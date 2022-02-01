import EventEmitter from '@js/Tools/EventEmitter';

import { Store } from '@js/Tools/Store';

export default class Nodes extends EventEmitter {
	static instance;

	constructor() {
		super();

		if (Nodes.instance) {
			return Nodes.instance;
		}
		Nodes.instance = this;

		window.addEventListener('DOMContentLoaded', () => {
			this.getNodes();
			this.event();

			this.trigger('load');
		});
	}

	getNodes() {
		this.dom = [...document.querySelectorAll('[data-ref]')];
		this.elements = {};

		for (const dom in this.dom) {
			if (this.elements[this.dom[dom].dataset.ref])
				this.elements[this.dom[dom].dataset.ref].push(this.dom[dom]);
			else this.elements[this.dom[dom].dataset.ref] = [this.dom[dom]];
		}

		for (const key in this.elements) {
			if (this.elements[key].length === 1) {
				const tmpValue = this.elements[key][0];
				this.elements[key] = tmpValue;
			}
		}
	}

	generateNodes() {
		const docFragment = document.createElement(DocumentFragment);

		document.body.appendChild(docFragment);

		this.resetNodes();
		this.getNodes();
	}

	resetNodes() {
		this.dom = [];
		this.elements = {};
	}

	event() {}
}
