import { Pane } from 'tweakpane';

import Stats from '@js/Tools/Stats';

const tabList = ['General'];

export default class Debug {
	constructor() {
		this.gui = new Pane();
		this.stats = new Stats();

		this.debugFolders = {};
		this.tabs = {};

		this.setTab();

		setTimeout(() => {
			this.setTab('Advanced');
		}, 2000);
	}

	setFolder(folder, label, tabLabel = 'General', expanded = true) {
		const tab = this.tabs.pages[this.getTab(tabLabel)];
		this.debugFolders[folder] = tab.addFolder({
			title: label,
			expanded: expanded,
		});
	}

	getFolder(folder) {
		return this.debugFolders[folder];
	}

	setTab(tab) {
		// let tabs = tabList;
		if (tab) tabList.push(tab);
		const pages = [];
		tabList.forEach((tab) => {
			pages.push({ title: tab });
		});

		this.tabs = this.gui.addTab({
			pages: pages,
		});
	}

	getTab(tab) {
		const check = tabList.indexOf(tab);
		if (check == -1)
			console.warn(
				`Tab '${tab}' doesn't exist ❗️ \n Setting folder in tab 'General' per default`,
			);

		const index = check == -1 ? 0 : check;
		return index;
	}
}
