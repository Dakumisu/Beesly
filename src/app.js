import './scss/main.scss'

import Webgl from '@js/Webgl/Webgl';

/// #if DEBUG
	console.log('debug mode');

	document.addEventListener('keydown', e => {
		console.log(`${e.key} touch pressed`)
	})
/// #endif

const sketch = new Webgl( document.querySelector('canvas.sketch') )
