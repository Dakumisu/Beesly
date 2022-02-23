import '@scss/main.scss';

import Dom from '@js/Dom/Dom';
import Webgl from '@js/Webgl/Webgl';

const dom = new Dom();

dom.nodes.on('load', () => {
	const webgl = new Webgl(dom.nodes.domElements.canvas);
});

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
