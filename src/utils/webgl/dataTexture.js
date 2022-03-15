import { DataTexture, FloatType } from 'three';

export function createDataTexture({
	data,
	tWidth,
	tHeight,
	format,
	filterType,
}) {
	const dataTexture = new DataTexture(
		data,
		tWidth,
		tHeight,
		format,
		FloatType,
	);

	dataTexture.minFilter = dataTexture.magFilter = filterType;
	dataTexture.needsUpdate = true;
	dataTexture.flipY = false;

	return dataTexture;
}
