export function randomDirection(vec, prng) {
	const random1 = prng ? prng.random() : Math.random();
	const random2 = prng ? prng.random() : Math.random();

	const theta = 2 * Math.PI * random1;
	const phi = Math.acos(2 * random2 - 1);

	vec.x = Math.sin(phi) * Math.cos(theta);
	vec.y = Math.sin(phi) * Math.sin(theta);
	vec.z = Math.cos(phi);

	return vec;
}
