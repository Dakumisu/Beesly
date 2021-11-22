// Seedable pseudo generator

import fastRandom from 'fast-random';

function prng(seed = 0) {
	let randomizer = fastRandom(seed);
	randomizer.nextFloat();
	randomizer.nextFloat();

	return {
		setSeed,
		random,
		randomFloat,
		randomInt,
		hash2d,
		hash2dInt
	};

	function setSeed(newSeed) {
		seed = newSeed;
		randomizer = fastRandom(seed);
	}

	function random() {
		return randomizer.nextFloat();
	}

	function randomFloat(min = 0, max = 1) {
		return randomizer.nextFloat() * (max - min) + min;
	}

	function randomInt(min, max) {
		return Math.floor(randomizer.nextFloat() * (max - min + 1)) + min;
	}

	function fract(x) {
		return x - Math.floor(x);
	}
	function dot(x1, y1, x2, y2) {
		return x1 * y2 - x2 * y1;
	}

	function hash2d(x, y) {
		return fract(Math.sin(dot(x, y, 12.9898, 78.233)) * 43758.5453);
	}

	function hash2dInt(x, y, min, max) {
		return Math.floor(hash2d(x, y) * (max - min + 1)) + min;
	}
}

const createPrng = prng;
const singleton = prng(Date.now());

export { createPrng, singleton };
export default singleton;
