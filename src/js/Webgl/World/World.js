import Blueprint from './Blueprint';
import Particles from './Particles';
import Model from './Model';
import GeoMerge from './GeoMerge';

let initialized = false;

export default class World {
	constructor(opt = {}) {
		this.setComponent();
	}

	setComponent() {
		// Examples
		this.blueprint = new Blueprint();
		this.particles = new Particles();
		this.model = new Model();
		this.geoMerge = new GeoMerge();

		initialized = true;
	}

	resize() {
		if (!initialized) return;

		if (this.blueprint) this.blueprint.resize();
		if (this.particles) this.particles.resize();
	}

	update(et, dt) {
		if (!initialized) return;

		if (this.blueprint) this.blueprint.update(et);
		if (this.particles) this.particles.update(et);
	}

	destroy() {
		if (!initialized) return;

		initialized = false;

		this.blueprint.destroy();
		this.particles.destroy();
		this.model.destroy();
		this.geoMerge.destroy();
	}
}
