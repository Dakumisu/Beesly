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
