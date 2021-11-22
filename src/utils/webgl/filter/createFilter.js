import { RawShaderMaterial, Scene, Mesh } from 'three';

import cam from './screenCam';
import bigTriangle from './bigTriangle';

let scene, screen;

export default function createFilter(renderer, vs, fs, opts) {
	const material = new RawShaderMaterial(Object.assign({}, {
		vertexShader: vs,
		fragmentShader: fs,
		transparent: true
	}, opts));

	if (!screen) {
		scene = new Scene();
		screen = new Mesh(bigTriangle, material);
		screen.frustumCulled = false;
		screen.matrixAutoUpdate = false;
		scene.add(screen);
	}

	const obj = {
		cam,
		scene,
		screen,
		material,
		uniforms: material.uniforms,
		u: material.uniforms,

		render() {
			const prevSort = renderer.sortObjects;
			renderer.sortObjects = false;
			screen.material = material;
			renderer.render(scene, cam);
			renderer.sortObjects = prevSort;
		}
	};

	return obj;
}
