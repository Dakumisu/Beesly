import '@scss/main.scss';

import signal from 'philbin-packages/signal';

import Dom from '@dom/Dom';
import { initWebgl } from '@webgl/Webgl';

const dom = new Dom();

signal.once('domLoaded', () => {
	const webgl = initWebgl(dom.nodes.domElements.canvas);
});

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
