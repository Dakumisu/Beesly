import Blueprint from './Blueprint';
import GeoMerge from './GeoMerge';
import Model from './Model';
import Particles from './Particles';

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

	destroy() {}
}
