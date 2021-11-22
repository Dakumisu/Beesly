export function norm(value, min = 0, max = 1) {
	return (value - min) / (max - min);
}
