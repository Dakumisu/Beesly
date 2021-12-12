import EventEmitter from './EventEmitter'

import { Store } from './Store'

export default class Device extends EventEmitter {
	constructor() {
		super()

		this.checkDevice()
	}

	checkDevice() {
		let device = null
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			device = 'Mobile'
		} else {
			device = 'Desktop'
		}

		Store.device = device
		console.log(Store.device)
	}
}
