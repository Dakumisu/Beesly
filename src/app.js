import './scss/main.scss'

import Webgl from '@js/Webgl/Webgl';
import Views from '@js/Views/Views';
import Nodes from '@js/Views/Nodes';

/* Init Essentials Stuff */
const nodes = new Nodes()
const views = new Views()

nodes.on('load', () => {
	const sketch = new Webgl( nodes.elements.canvas )
})

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
