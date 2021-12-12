import EventEmitter from '@js/Tools/EventEmitter'

import { Store } from '@js/Tools/Store'

export default class Views extends EventEmitter {
	constructor() {
		super()

		this.dom = [...document.querySelectorAll('[data-ref]')]
		this.nodes = {}

		this.currentView = null

		this.setViewsList()
		this.initNodes()
		this.event()

		setTimeout(() => {
			this.changeView('home')
		}, 2000);
	}

	setViewsList() {
		this.views = {
			home: 'home',
			exp: 'exp'
		}
	}

	initNodes() {
		for (const dom in this.dom) {
			this.nodes[this.dom[dom].dataset.ref] = this.dom[dom]
		}

		Store.nodes = this.nodes

		this.currentView = this.views['home']
	}

	changeView(view) {
		this.currentView = this.views[view]

		this.trigger('changeView')
	}

	getView() {
		return this.currentView
	}

	event() {

	}
}
