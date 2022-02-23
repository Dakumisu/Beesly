import Emitter from '@js/Tools/Emitter';

import Nodes from './Nodes';
import HomeElement from './Shadow/home/HomeElement';
import Views from './Views';

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
