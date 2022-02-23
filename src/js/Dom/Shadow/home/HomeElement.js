import ShadowElement from '../shadowElement';

import { loadHTML } from '@utils/loader/loadHTML';
import { wait } from 'philbin-packages/utils';

import homeStyle from './home.scss';
import mainStyle from '@scss/main.scss';

export default class HomeElement extends ShadowElement {
	static initialized;

	constructor() {
		super();

		this.setShadowComponent();
	}

	async setShadowComponent() {
		const html = await loadHTML('./home.html', import.meta.url);

		const template = document.createElement('template');
		template.innerHTML = html;

		const style = document.createElement('style');
		style.type = 'text/css';
		this.styleNode = document.createTextNode(homeStyle + mainStyle);
		style.appendChild(this.styleNode);

		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.shadowRoot.appendChild(style);

		this.update();
	}

	destroy() {
		this.remove();
	}

	update() {
		console.log(import.meta.hot);
		if (import.meta.hot) {
			import.meta.hot.on('vite:beforeUpdate', async (data) => {
				const home = await import('./home.scss');
				const main = await import('@scss/main.scss');
				console.log(home.default);

				// const scssUrl = new URL('./home.scss', import.meta.url).href;
				// const test = await fetch(scssUrl).then((response) =>
				// 	response.text(),
				// );
				// console.log(test);
				// console.log(this.styleNode.data);
				// const scssUrl = new URL('./home.scss', import.meta.url).href;
				// const test = await fetch(scssUrl).then((response) =>
				// 	response.text(),
				// );

				// const test2 = test.split(`= "`)[2].split(`}"`)[0];
				// console.log(
				// 	document.createTextNode(
				// 		test.split(`= "`)[2].split(`}"`)[0],
				// 	),
				// );
				// this.styleNode.data = document.createTextNode(
				// 	test.split(`= "`)[2].split(`}"`)[0] + mainStyle,
				// );
				// console.log(test.split(`= "`)[2].split(`}"`)[0] + mainStyle);
				// console.log(this.styleNode.data);
			});
		}
	}
}

customElements.define('home-page', HomeElement);
