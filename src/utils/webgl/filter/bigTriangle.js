// Create a big triangle for post-processing purpose
// Ref: https://michaldrobot.com/2014/04/01/gcn-execution-patterns-in-full-screen-passes/

import {	BufferGeometry, BufferAttribute } from 'three';

const positions = new Float32Array([
	-2, 0,
	0, -2,
	2, 2
]);

const bigTriangle = new BufferGeometry();

// console.log(bigTriangle);
bigTriangle.setAttribute(
	'position',
	new BufferAttribute(positions, 2)
);

export default bigTriangle;
