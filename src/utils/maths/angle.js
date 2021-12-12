export function angle(cx, cy, ex, ey) {
	let theta = Math.atan2(ey, ex) - Math.atan2(cy, cx);

	if (theta > Math.PI) {
		theta -= 2 * Math.PI
	} else if (theta <= -Math.PI) {
		theta += 2 * Math.PI
	}

	return theta;
};
