import './scss/main.scss';

import Webgl from './js/webgl/Webgl';
import Nodes from './js/views/Nodes';

const nodes = new Nodes();

nodes.on('load', () => {
	const webgl = new Webgl(nodes.elements.canvas);
});

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
