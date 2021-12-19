import './scss/main.scss'

import Webgl from '@js/Webgl/Webgl';

const sketch = new Webgl( document.querySelector('canvas.sketch') )

/// #if DEBUG
	console.log('debug mode');

	document.addEventListener('keydown', e => {
		console.log(`${e.key} touch pressed`)
	})
/// #endif
