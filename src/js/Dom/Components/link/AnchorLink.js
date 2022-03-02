import Dom from '@js/Dom/Dom';

import html from './template.html?raw';
import style from './style.scss';

export default class AnchorLink extends HTMLElement {
	static get observedAttributes() {
		return ['label', 'link', 'blank', 'ref'];
	}

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });

		this.setShadowComponent();
	}

	get span() {
		return this.shadowRoot.querySelector('span');
	}

	get anchor() {
		return this.shadowRoot.querySelector('a');
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
		dom.nodes.delete(this.dataset.ref);
	}

	adoptedCallback() {
		/// #if DEBUG
		console.log(`Element ${this.localName} moved to new page.`);
		/// #endif
	}

	attributeChangedCallback(attrName, oldValue, newValue) {
		switch (attrName) {
			case 'label':
				this.span.innerHTML = newValue;
				break;
			case 'link':
				this.anchor.href = newValue;
				break;
			case 'blank':
				this.anchor.target = '_blank';
				break;
			case 'ref':
				this.anchor.dataset.ref = newValue;
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

customElements.define('anchor-link', AnchorLink);
