import Emitter from '@js/Tools/Emitter';

import Nodes from './Nodes';
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

		this.init();
	}

	init() {
		this.nodes = new Nodes();
		this.views = new Views();
	}

	event() {
		if (!initialized) return;
	}
}