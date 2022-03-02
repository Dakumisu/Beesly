import Emitter from './Emitter';

import { store } from './Store';

const html = document.documentElement;
const deviceList = ['desktop', 'mobile'];

export default class Device extends Emitter {
	constructor() {
		super();

		this.checkDevice();
		this.checkBrowser();
		this.setHtmlStyle();
		this.getRootStyle();

		document.addEventListener(
			'visibilitychange',
			this.checkVisibility.bind(this),
		);
	}

	checkDevice() {
		let device = null;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			)
		) {
			device = deviceList[1]; // Mobile
		} else {
			device = deviceList[0]; // Desktop
		}

		deviceList.forEach((e) => {
			if (e === device) html.classList.add(e);
			else html.classList.remove(e);
		});

		store.device = device;
	}

	checkBrowser() {
		const agent = navigator.userAgent;
		let browserName = '';
		let fullVersion = '';
		let browserMajorVersion = '';
		let offsetName, offsetVersion, ix;

		// In Chrome
		if ((offsetVersion = agent.indexOf('Chrome')) != -1) {
			browserName = 'chrome';
			fullVersion = agent.substring(offsetVersion + 7);
		}

		// In Microsoft internet explorer
		else if ((offsetVersion = agent.indexOf('MSIE')) != -1) {
			browserName = 'microsoft-internet-explorer';
			fullVersion = agent.substring(offsetVersion + 5);
		}

		// In Firefox
		else if ((offsetVersion = agent.indexOf('Firefox')) != -1) {
			browserName = 'firefox';
		}

		// In Safari
		else if ((offsetVersion = agent.indexOf('Safari')) != -1) {
			browserName = 'safari';
			fullVersion = agent.substring(offsetVersion + 7);
			if ((offsetVersion = agent.indexOf('Version')) != -1)
				fullVersion = agent.substring(offsetVersion + 8);
		}

		// For other browser "name/version" is at the end of userAgent
		else if (
			(offsetName = agent.lastIndexOf(' ') + 1) <
			(offsetVersion = agent.lastIndexOf('/'))
		) {
			browserName = agent.substring(offsetName, offsetVersion);
			fullVersion = agent.substring(offsetVersion + 1);
			if (browserName.toLowerCase() == browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}

		// trimming the fullVersion string at semicolon/space if present
		if ((ix = fullVersion.indexOf(';')) != -1)
			fullVersion = fullVersion.substring(0, ix);
		if ((ix = fullVersion.indexOf(' ')) != -1)
			fullVersion = fullVersion.substring(0, ix);
		browserMajorVersion = parseInt('' + fullVersion, 10);
		if (isNaN(browserMajorVersion)) {
			fullVersion = '' + parseFloat(navigator.appVersion);
			browserMajorVersion = '' + parseInt(navigator.appVersion, 10);
		}

		html.classList.add(browserName, browserMajorVersion);
		store.browser = browserName;
	}

	setHtmlStyle() {
		html.style.setProperty('--vp-height', `${store.resolution.height}px`);
		html.style.setProperty('--vp-width', `${store.resolution.width}px`);
	}

	getRootStyle() {
		const styleSheets = document.styleSheets[0].cssRules;
		const rootStyleName = [];
		const rootStyle = {};

		for (const key in styleSheets) {
			if (styleSheets[key].selectorText === ':root') {
				if (styleSheets[key].style.length) {
					for (let i = 0; i < styleSheets[key].style.length; i++) {
						const name = styleSheets[key].style[i];

						if (name.startsWith('--') && !name.startsWith('--tp')) {
							rootStyleName.push(name);
						}
					}
				}
			}
		}

		for (let i = 0; i < rootStyleName.length; i++) {
			if (getComputedStyle(html).getPropertyValue(rootStyleName[i])) {
				rootStyle[rootStyleName[i]] = getComputedStyle(
					html,
				).getPropertyValue(rootStyleName[i]);
			}
		}

		store.style = rootStyle;
	}

	checkVisibility() {
		this.emit('visibility', [!document.hidden]);
	}

	resize() {
		this.checkDevice();
		this.setHtmlStyle();
	}

	destroy() {
		store.device = null;
		store.browser = null;
		store.style = null;

		html.style.removeProperty('--vp-height');
		html.style.removeProperty('--vp-width');
		html.removeAttribute('class');

		this.resolveName('visibility');

		document.removeEventListener(
			'visibilitychange',
			this.checkVisibility.bind(this),
		);
	}
}
