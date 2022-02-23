import { Matrix4 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer/meshopt_decoder.module';

const gltfLoader = new GLTFLoader();
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

async function loadGLTF(url, opts = {}) {
	return new Promise((resolve, reject) => {
		gltfLoader.load(
			url,
			(data) => {
				if (opts.onLoad) opts.onLoad(data);
				resolve(data);
			},
			() => {},
			reject,
		);
	});
}

onmessage = function (e) {
	const url = e.data.url;

	getModelGeometryAttributes(url).then((response) => {
		const attributes = response;

		postMessage(attributes);
	});
};

function getModelGeometryAttributes(url) {
	return new Promise((resolve) => {
		loadGLTF(url).then((e) => {
			parseModel(e).then((response) => {
				resolve(response);
			});
		});
	});
}

function parseModel(model) {
	const geosAttributes = [];
	const mat4 = new Matrix4();

	return new Promise((resolve) => {
		model.scene.traverse((mesh) => {
			if (mesh.geometry) {
				const geo = mesh.geometry;

				mesh.updateWorldMatrix(true, false);
				mat4.multiplyMatrices(mesh.matrixWorld, mesh.matrix);
				geo.applyMatrix4(mesh.matrixWorld);

				let index = geo.index.array;
				let pos = geo.attributes.position.array;
				let normal = geo.attributes.normal.array;
				let uv = geo.attributes.uv.array;

				const geoAttributes = { index, pos, normal, uv };

				geosAttributes.push(geoAttributes);
			}
		});

		resolve(geosAttributes);
	});
}
