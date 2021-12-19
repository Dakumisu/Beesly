import EventEmitter from './EventEmitter'

import { Store } from './Store'

const html = document.querySelector('html')

export default class Device extends EventEmitter {
	constructor() {
		super()

		this.checkDevice()
		this.checkBrowser()
	}

	checkDevice() {
		let device = null
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			device = 'Mobile'
		} else {
			device = 'Desktop'
		}

		html.classList.add(device)

		Store.device = device
	}

	checkBrowser() {
		const agent = navigator.userAgent;
		let browserName = navigator.appName;
		let fullVersion = '' + parseFloat(navigator.appVersion);
		let browserMajorVersion = parseInt(navigator.appVersion, 10);
		let offsetName, offsetVersion, ix;

		// In Chrome
		if ((offsetVersion = agent.indexOf("Chrome")) != -1) {
			browserName = "Chrome";
			fullVersion = agent.substring(offsetVersion + 7);
		}

		// In Microsoft internet explorer
		else if ((offsetVersion = agent.indexOf("MSIE")) != -1) {
			browserName = "Microsoft Internet Explorer";
			fullVersion = agent.substring(offsetVersion + 5);
		}

		// In Firefox
		else if ((offsetVersion = agent.indexOf("Firefox")) != -1) {
			browserName = "Firefox";
		}

		// In Safari
		else if ((offsetVersion = agent.indexOf("Safari")) != -1) {
			browserName = "Safari";
			fullVersion = agent.substring(offsetVersion + 7);
			if ((offsetVersion = agent.indexOf("Version")) != -1)
				fullVersion = agent.substring(offsetVersion + 8);
		}

		// For other browser "name/version" is at the end of userAgent
		else if ((offsetName = agent.lastIndexOf(' ') + 1) < (offsetVersion = agent.lastIndexOf('/'))) {
			browserName = agent.substring(offsetName, offsetVersion);
			fullVersion = agent.substring(offsetVersion + 1);
			if (browserName.toLowerCase() == browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}

		// trimming the fullVersion string at semicolon/space if present
		if ((ix = fullVersion.indexOf(";")) != -1) fullVersion = fullVersion.substring(0, ix);
		if ((ix = fullVersion.indexOf(" ")) != -1)
			fullVersion = fullVersion.substring(0, ix);
		browserMajorVersion = parseInt('' + fullVersion, 10);
		if (isNaN(browserMajorVersion)) {
			fullVersion = '' + parseFloat(navigator.appVersion);
			browserMajorVersion = parseInt(navigator.appVersion, 10);
		}

		html.classList.add(browserName, browserMajorVersion)
		Store.browser = browserName
	}
}
