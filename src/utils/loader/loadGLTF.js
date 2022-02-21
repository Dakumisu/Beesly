import {
	BufferAttribute,
	BufferGeometry,
	DoubleSide,
	Group,
	Mesh,
	MeshNormalMaterial,
} from 'three';

import wLoadGLTF from '@workers/wLoadGLTF?worker';

export default function loadModel(model) {
	return new Promise((resolve) => {
		loadGLTF(model).then((response) => {
			const geometries = [...response];

			setMesh(geometries).then((response) => {
				resolve(response);
			});
		});
	});
}

function loadGLTF(src) {
	const worker = wLoadGLTF();

	const geometries = [];

	return new Promise((resolve) => {
		worker.postMessage({
			url: src,
		});

		worker.addEventListener('message', (e) => {
			const geo = e.data;

			geo.forEach((attributes) => {
				const bufferGeo = new BufferGeometry();

				// Conversion des attributes du model en geometry
				bufferGeo.setIndex(
					new BufferAttribute(attributes.index, 1, false),
				);
				bufferGeo.setAttribute(
					'position',
					new BufferAttribute(attributes.pos, 3, false),
				);
				bufferGeo.setAttribute(
					'normal',
					new BufferAttribute(attributes.normal, 3, false),
				);
				bufferGeo.setAttribute(
					'uv',
					new BufferAttribute(attributes.uv, 2, false),
				);

				geometries.push(bufferGeo);
			});

			worker.terminate();
			resolve(geometries);
		});
	});
}

function setMesh(geometries) {
	return new Promise((resolve) => {
		const group = new Group();

		const material = new MeshNormalMaterial({
			side: DoubleSide,
		});

		geometries.forEach((geometry) => {
			const mesh = new Mesh(geometry, material);
			mesh.frustumCulled = false;

			group.add(mesh);
		});

		resolve(group);
	});
}
