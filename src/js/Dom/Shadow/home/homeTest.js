import ShadowElement from '@js/Dom/Shadow/ShadowElement';

import { loadHTML } from '@utils/loader/loadHTML';
import { wait } from 'philbin-packages/utils';

import homeStyle from './home.scss';
import mainStyle from '@scss/main.scss';

import html from './home.html?raw';

export default class HomeTest extends ShadowElement {
	static initialized;

	constructor() {
		super();

		this.checkStyle = {};
		this.checkStyle.home = homeStyle;
		this.checkStyle.main = mainStyle;

		this.setShadowComponent();
	}

	async setShadowComponent() {
		// const html = await loadHTML('./home.html', import.meta.url);

		const template = document.createElement('template');
		template.innerHTML = html;

		const style = document.createElement('style');
		style.type = 'text/css';
		this.styleNode = document.createTextNode(homeStyle + '\n' + mainStyle);
		style.appendChild(this.styleNode);

		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.shadowRoot.appendChild(style);

		this.update();
	}

	destroy() {
		this.remove();
	}

	update() {
		if (import.meta.hot) {
			import.meta.hot.on('vite:beforeUpdate', async (data) => {
				const homeScssUrl = new URL('./home.scss', import.meta.url)
					.href;
				const homeScssFile = await fetch(homeScssUrl).then((response) =>
					response.text(),
				);
				const mainScssUrl = new URL(
					'../../../../scss/main.scss',
					import.meta.url,
				).href;
				const mainScssFile = await fetch(mainScssUrl).then((response) =>
					response.text(),
				);

				const homeScss = JSON.parse(
					'"' +
						homeScssFile.match(
							/__vite__css = "((?:.|\n)+?[^\\])"\n/i,
						)[1] +
						'"',
				);
				const mainScss = JSON.parse(
					'"' +
						mainScssFile.match(
							/__vite__css = "((?:.|\n)+?[^\\])"\n/i,
						)[1] +
						'"',
				);

				let newHomeStyle = this.checkStyle.home;
				let newMainStyle = this.checkStyle.main;

				if (this.checkStyle.home != homeScss)
					newHomeStyle = this.checkStyle.home = homeScss;

				if (this.checkStyle.main != mainScss)
					newMainStyle = this.checkStyle.main = mainScss;

				this.styleNode.data = newHomeStyle + '\n' + newMainStyle;
			});
		}
	}
}

customElements.define('home-page', HomeTest);
