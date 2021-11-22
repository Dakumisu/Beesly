export function sqdist(x1, y1, x2, y2) {
	return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

export function dist(x1, y1, x2, y2) {
	return Math.sqrt(sqdist(x1, y1, x2, y2));
}
