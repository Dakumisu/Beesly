import Dom from '../Dom';

export default class ShadowElement extends HTMLElement {
	static get observedAttributes() {
		return [''];
	}

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
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

	attributeChangedCallback(name, oldValue, newValue) {
		/// #if DEBUG
		console.log(`Element ${this.localName} attributes changed.`);
		/// #endif
	}
}
