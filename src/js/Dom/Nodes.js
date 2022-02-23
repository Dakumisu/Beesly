import Emitter from '@js/Tools/Emitter';

import { store } from '@js/Tools/Store';
import { wait } from 'philbin-packages/utils';

let initialized = false;

export default class Nodes extends Emitter {
	constructor() {
		super();

		this.event();

		window.addEventListener('DOMContentLoaded', async () => {
			await this.getNodes();
			await wait(100);
			await this.getShadowNodes();

			initialized = true;
			this.emit('load');
		});

		this.event();
	}

	async getNodes() {
		if (this.domElements) return this.domElements;

		this.domRef = [...document.querySelectorAll('[data-ref]')];
		this.domElements = {};

		new Promise((resolve) => {
			for (const key in this.domRef) {
				if (this.domElements[this.domRef[key].dataset.ref])
					this.domElements[this.domRef[key].dataset.ref].push(
						this.domRef[key],
					);
				else
					this.domElements[this.domRef[key].dataset.ref] = [
						this.domRef[key],
					];
			}

			resolve();
		});

		return new Promise((resolve) => {
			for (const key in this.domElements) {
				if (this.domElements[key].length === 1) {
					const tmpValue = this.domElements[key][0];
					this.domElements[key] = tmpValue;
				}
			}

			resolve();
		});
	}

	async getShadowNodes() {
		if (this.shadowElements) return this.shadowElements;

		this.shadowElements = {};

		for (const key in this.domElements) {
			if (this.domElements[key].shadowRoot) {
				const parent = this.domElements[key];
				const parentName = this.domElements[key].dataset.ref;
				const childContainer = parent.shadowRoot.children[1];

				this.shadowElements[parentName] = {};

				this.shadowRef = [
					...childContainer.querySelectorAll('[data-ref]'),
				];

				for (const key in this.shadowRef) {
					if (
						this.shadowElements[parentName][
							this.shadowRef[key].dataset.ref
						]
					)
						this.shadowElements[parentName][
							this.shadowRef[key].dataset.ref
						].push(this.shadowRef[key]);
					else
						this.shadowElements[parentName][
							this.shadowRef[key].dataset.ref
						] = [this.shadowRef[key]];
				}
			}
		}

		return new Promise((resolve) => {
			for (const key in this.shadowElements) {
				const parent = this.shadowElements[key];
				for (const key in parent) {
					if (parent[key].length === 1) {
						const tmpValue = parent[key][0];
						parent[key] = tmpValue;
					}
				}
			}

			resolve();
		});
	}

	destroy() {
		delete this.domRef;
		delete this.shadowRef;
		delete this.domElements;
		delete this.shadowElements;
	}

	async reset() {
		this.destroy();

		await this.getNodes();
		await wait(100);
		await this.getShadowNodes();
	}

	event() {
		if (!initialized) return;
	}
}
