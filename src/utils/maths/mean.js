export function mean(values) {
	let val = 0;
	const len = values.length;
	for (let i = 0; i < len; i++) val += values[ i ];
	return val / len;
}
