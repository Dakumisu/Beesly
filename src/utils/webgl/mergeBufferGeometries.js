import { BufferAttribute, BufferGeometry, Matrix4, Object3D } from 'three';

import wMergeGeo from '@workers/wMergeGeo?worker';

import loadGLTF from '@utils/loader/loadGLTF';

let geometries = [];

export default function mergeGeometry(geos = [], models = []) {
	return new Promise((resolve) => {
		if (!geos.length && !models.length) {
			console.error('Geometry required 🚫');
			resolve(null);
		}

		geometries.push(...geos);

		loadModels(models).then(() => {
			geometriesFilter();
			mergeGeometries().then((e) => {
				resolve(e);
			});
		});
	});
}

function geometriesFilter() {
	let count = geometries.length;

	for (let i = 0; i < count; i++) {
		const element = geometries[i];

		if (element instanceof Object3D) {
			const geos = [];

			element.traverse((child) => {
				if (child.geometry) {
					const mat4 = new Matrix4();

					child.updateWorldMatrix(true, false);
					mat4.multiplyMatrices(child.matrixWorld, child.matrix);
					child.geometry.applyMatrix4(child.matrixWorld);

					geos.push(child.geometry);
				}
			});

			geometries.splice(i, 1, ...geos);
			i += geos.length - 1;
			count += geos.length - 1;
		}
	}
}

function loadModels(models) {
	let count = 0;

	return new Promise((resolve) => {
		models.forEach((modelSrc) => {
			loadGLTF(modelSrc).then((response) => {
				geometries.push(response);

				count++;
				if (count === models.length) {
					resolve(geometries);
				}
			});
		});
	});
}

function mergeGeometries() {
	return new Promise((resolve) => {
		mergeBufferGeometries([...geometries]).then((response) => {
			geometries.forEach((geometry) => {
				geometry.dispose();
				geometries = [];
			});

			resolve(response);
		});
	});
}

function mergeBufferGeometries(datas) {
	const worker = wMergeGeo();

	const bufferGeometries = [];
	const buffers = [];

	return new Promise((resolve) => {
		for (let i = 0; i < datas.length; i++) {
			bufferGeometries[i] = {};
			bufferGeometries[i].index = datas[i].index.array;
			bufferGeometries[i].position = datas[i].attributes.position.array;
			bufferGeometries[i].normal = datas[i].attributes.normal.array;
			bufferGeometries[i].uv = datas[i].attributes.uv.array;

			buffers.push(datas[i].index.array.buffer);
			buffers.push(datas[i].attributes.position.array.buffer);
			buffers.push(datas[i].attributes.normal.array.buffer);
			buffers.push(datas[i].attributes.uv.array.buffer);
		}

		worker.postMessage(
			{
				geometries: bufferGeometries,
			},
			[...new Set(buffers)],
		);

		worker.addEventListener('message', (response) => {
			const geo = response.data;

			const bufferGeo = new BufferGeometry();

			// Conversion des attributes mergés en geometry
			bufferGeo.setIndex(new BufferAttribute(geo.index, 1, false));
			bufferGeo.setAttribute(
				'position',
				new BufferAttribute(geo.pos, 3, false),
			);
			bufferGeo.setAttribute(
				'normal',
				new BufferAttribute(geo.normal, 3, false),
			);
			bufferGeo.setAttribute('uv', new BufferAttribute(geo.uv, 2, false));

			worker.terminate();
			resolve(bufferGeo);
		});
	});
}
