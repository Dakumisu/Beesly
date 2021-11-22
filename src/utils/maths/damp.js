import { lerp, lerpPrecise } from './lerp';

export function damp(a, b, smoothing, dt) {
	return lerp(a, b, 1 - Math.exp(-smoothing * 0.05 * dt));
}

export function dampPrecise(a, b, smoothing, dt, limit) {
	return lerpPrecise(a, b, 1 - Math.exp(-smoothing * 0.05 * dt), limit);
}
