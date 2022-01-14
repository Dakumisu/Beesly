import './scss/main.scss'

import Webgl from '@js/Webgl/Webgl';
import Views from '@js/Views/Views';

/* Init Essentials Stuff */
const views = new Views()

views.on('load', () => {
	const sketch = new Webgl( views.nodes.canvas )
})

/// #if DEBUG
console.log('debug mode');
/// #endif
