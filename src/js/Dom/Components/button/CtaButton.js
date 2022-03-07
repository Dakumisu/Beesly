import Dom from '@dom/Dom';

import html from './template.html?raw';
import style from './style.scss';

export default class CtaButton extends HTMLElement {
	static get observedAttributes() {
		return ['label', 'size', 'ref'];
	}

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });

		this.setShadowComponent();
	}

	get span() {
		return this.shadowRoot.querySelector('span');
	}

	get button() {
		return this.shadowRoot.querySelector('button');
	}

	get container() {
		return this.shadowRoot.querySelector('div');
	}

	connectedCallback() {
		/// #if DEBUG
		console.log(`Element ${this.localName} added to page.`);
		/// #endif
	}

	disconnectedCallback() {
		/// #if DEBUG
		console.log(`Element ${this.localName} removed from page.`);
		/// #endif

		const dom = new Dom();
		dom.nodes.reset();
	}

	adoptedCallback() {
		/// #if DEBUG
		console.log(`Element ${this.localName} moved to new page.`);
		/// #endif
	}

	attributeChangedCallback(attrName, oldValue, newValue) {
		switch (attrName) {
			case 'label':
				this.button.innerHTML = newValue;
				break;
			case 'size':
				this.container.setAttribute('size', newValue);
				break;
			case 'ref':
				this.button.dataset.ref = newValue;
				break;
		}

		/// #if DEBUG
		console.log(`Element ${this.localName} attributes changed.`);
		/// #endif
	}

	async setShadowComponent() {
		const template = document.createElement('template');
		template.innerHTML = html;

		const s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		this.styleNode = document.createTextNode(style);
		s.appendChild(this.styleNode);

		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.shadowRoot.appendChild(s);

		this.updateStyle();
	}

	updateStyle() {
		if (import.meta.hot) {
			import.meta.hot.on('vite:beforeUpdate', async () => {
				const composentScssUrl = new URL(
					'./style.scss',
					import.meta.url,
				).href;
				const composentScssFile = await fetch(composentScssUrl).then(
					(response) => response.text(),
				);

				const composentScss = JSON.parse(
					`"${
						composentScssFile.match(
							/__vite__css = "((?:.|\n)+?[^\\])"\n/i,
						)[1]
					}"`,
				);

				this.styleNode.data = composentScss;
			});
		}
	}
}

customElements.define('cta-button', CtaButton);
