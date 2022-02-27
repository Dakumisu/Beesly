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

	setFolder(folderLabel, tabLabel = tabList[0], expanded = true) {
		const l = folderLabel.toLowerCase();
		const tab = this.getTab(tabLabel);
		this.debugFolders[l] = tab.addFolder({
			title: folderLabel,
			expanded: expanded,
		});
	}

	getFolder(folderLabel) {
		const l = folderLabel.toLowerCase();
		return this.debugFolders[l];
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
		const checkIndex = tabList.indexOf(tabLabel);
		if (checkIndex == -1)
			console.warn(
				`Tab '${tabLabel}' doesn't exist ❗️ \n Setting folder in tab 'General' per default`,
			);

		const index = checkIndex == -1 ? 0 : checkIndex;
		return this.tabs.pages[index];
	}

	destroy() {
		this.gui.dispose();
		this.stats.destroy();
	}
}
