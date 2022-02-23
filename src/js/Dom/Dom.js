import Emitter from '@js/Tools/Emitter';

import Nodes from './Nodes';
import Views from './Views';

import Home from '@js/Dom/Shadow/Home/Home';

let initialized = false;

export default class Dom extends Emitter {
	static instance;

	constructor() {
		super();

		if (Dom.instance) {
			return Dom.instance;
		}
		Dom.instance = this;

		this.pages = {};

		this.init();
		this.shadowDom();
	}

	init() {
		this.nodes = new Nodes();
		this.views = new Views();
	}

	shadowDom() {
		// this.pages.home = new HomeElement();
	}

	event() {
		if (!initialized) return;
	}
}
