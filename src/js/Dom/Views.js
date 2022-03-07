import Emitter from '@tools/Emitter';

import { store } from '@tools/Store';

const defaultViewList = ['home', 'exp'];

export default class Views extends Emitter {
	constructor() {
		super();

		this.setViewsList();
	}

	setViewsList() {
		this.viewList = {};
		defaultViewList.forEach((view) => {
			this.viewList[view] = view;
		});

		this.currentView = this.viewList['home'];

		store.views = this.viewList;
	}

	addView(view) {
		if (this.viewList[view])
			return console.warn(`View '${view}' already exist ❗`);

		this.viewList[view] = view;
		store.views = this.viewList;

		/// #if DEBUG
		console.log(`View '${view}' added to the list ✔`);
		/// #endif
	}

	removeView(view) {
		if (!this.viewList[view])
			return console.warn(`View '${view}' doesn't exist ❗`);

		delete this.viewList[view];
		store.views = this.viewList;

		/// #if DEBUG
		console.log(`View '${view}' removed to the list ✔`);
		/// #endif
	}

	changeView(view) {
		if (!view) return console.error(`View's name required 🚫`);
		if (!this.viewList[view])
			return console.error(`View '${view}' doesn't exist 🚫`);

		this.currentView = this.viewList[view];
		this.emit('changeView', [this.currentView]);
	}

	getView() {
		return this.currentView;
	}

	destroy() {
		this.currentView = '';
		store.views = null;
		delete this.viewList;
	}
}
