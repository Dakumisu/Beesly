import { Pane } from 'tweakpane';

import Stats from '@js/Tools/Stats';

const tabList = ['General', 'Stats'];

export default class Debug {
	constructor() {
		this.gui = new Pane();
		this.stats = new Stats();

		this.debugFolders = {};
		this.tabs = {};

		this.initTab();
	}

	setFolder(folderLabel, title, tabLabel = 'General', expanded = true) {
		const tab = this.getTab(tabLabel);
		this.debugFolders[folderLabel] = tab.addFolder({
			title: title,
			expanded: expanded,
		});
	}

	getFolder(folderLabel) {
		return this.debugFolders[folderLabel];
	}

	initTab() {
		const pages = [];
		tabList.forEach((tab) => {
			pages.push({ title: tab });
		});

		this.tabs = this.gui.addTab({
			pages: pages,
		});
	}

	getTab(tabLabel, folderLabel) {
		const check = tabList.indexOf(tabLabel);
		if (check == -1)
			console.warn(
				`Tab '${tabLabel}' doesn't exist ❗️ \n Setting folder in tab 'General' per default`,
			);

		const index = check == -1 ? 0 : check;
		return this.tabs.pages[index];
	}
}
