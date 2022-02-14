import EventEmitter from '@js/tools/EventEmitter';

import { store } from '@js/tools/Store';

const viewList = ['home', 'exp'];

export default class Views extends EventEmitter {
	constructor() {
		super();

		this.setViewsList();
		this.currentView = this.viewList['home'];

		this.event();
	}

	setViewsList() {
		this.viewList = {};
		viewList.forEach((view) => {
			this.viewList[view] = view;
		});
	}

	changeView(view) {
		if (!view) {
			console.error(`View's name required 🚫`);
			return;
		}
		if (!this.viewList[view]) {
			console.error(`View '${view}' doesn't exist 🚫`);
			return;
		}

		this.currentView = this.viewList[view];
		this.trigger('changeView', [this.currentView]);
	}

	getView() {
		return this.currentView;
	}

	event() {}
}
