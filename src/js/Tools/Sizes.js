import EventEmitter from '@js/Tools/EventEmitter'
import { Store } from '@js/Tools/Store'

export default class Sizes extends EventEmitter {
	constructor() {
		super()

		// Resize event
		window.addEventListener('resize', this.resize.bind(this))
	}

	resize() {
		Store.resolution.width = window.innerWidth
		Store.resolution.height = window.innerHeight
		Store.resolution.dpr = window.devicePixelRatio

		this.trigger('resize')
	}
}
