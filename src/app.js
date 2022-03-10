import '@scss/main.scss';

import signal from 'signal-js';

import Dom from '@dom/Dom';
import { initWebgl } from '@webgl/Webgl';

signal.once('domLoaded', () => {
	const webgl = initWebgl(dom.nodes.domElements.canvas);
});
const dom = new Dom();

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
