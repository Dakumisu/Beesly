import '@scss/main.scss';

import Dom from '@dom/Dom';
import { getWebgl } from '@webgl/Webgl';

const dom = new Dom();

dom.nodes.on('load', () => {
	const webgl = getWebgl(dom.nodes.domElements.canvas);
});

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
