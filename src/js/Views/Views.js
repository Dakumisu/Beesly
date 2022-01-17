import EventEmitter from '@js/Tools/EventEmitter'

import { Store } from '@js/Tools/Store'

const viewList = [
	'home',
	'exp'
]

export default class Views extends EventEmitter {
	static instance

	constructor() {
		super()

		if (Views.instance) {
			return Views.instance
		}
		Views.instance = this

		this.setViewsList()
		this.currentView = this.viewList['home']

		this.event()
	}

	setViewsList() {
		this.viewList = {}
		viewList.forEach(view => {
			this.viewList[view] = view
		})
	}

	changeView(view) {
		if(!view) {
			console.error(`View's name required 🚫`)
			return
		}
		if(!this.viewList[view]) {
			console.error(`This view '${view}' doesn't exist 🚫`)
			return
		}

		this.currentView = this.viewList[view]
		this.trigger('changeView', [this.currentView])
	}

	getView() {
		return this.currentView
	}

	event() {

	}
}
