import { Scene as ThreeScene } from 'three';

export default class Scene {
	constructor(opt = {}) {
		this.instance = new ThreeScene();
	}

	cleanScene() {
		this.instance.traverse((object) => {
			if (!object.isMesh) return;

			if (object.material.isMaterial) {
				this.cleanMaterial(object.material);
			} else {
				for (const material of object.material) {
					this.cleanMaterial(material);
				}
			}
		});
	}

	cleanMaterial(mat) {
		mat.dispose();

		for (const key of Object.keys(mat)) {
			const value = mat[key];
			if (value && typeof value === 'object' && 'minFilter' in value) {
				value.dispose();
			}
		}
	}

	destroy() {
		this.cleanScene();
	}
}
