import '@scss/main.scss';

import Dom from '@js/Dom/Dom';
import { getWebgl } from '@js/Webgl/Webgl';

const dom = new Dom();

dom.nodes.on('load', () => {
	const webgl = getWebgl(dom.nodes.domElements.canvas);
});

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
