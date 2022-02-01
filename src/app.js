import './scss/main.scss';

import Webgl from '@js/Webgl/Webgl';
import Nodes from '@js/Views/Nodes';

const nodes = new Nodes();

nodes.on('load', () => {
	const webgl = new Webgl(nodes.elements.canvas);
});

/// #if DEBUG
console.log('debug mode 🔥');
/// #endif
