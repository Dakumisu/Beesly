export function lerp(start, end, t) {
	return start * (1 - t) + end * t;
}

export function lerpPrecise(start, end, t, limit = 0.001) {
	const v = start * (1 - t) + end * t;
	return Math.abs(end - v) < limit ? end : v;
}
