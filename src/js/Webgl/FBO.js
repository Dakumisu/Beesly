/* Credits @tuqire (https://github.com/tuqire/three.js-fbo) ✨ */

import {
	NearestFilter,
	RGBAFormat,
	ShaderMaterial,
	OrthographicCamera,
	Scene,
	PlaneGeometry,
	Mesh,
	WebGLRenderTarget,
	HalfFloatType,
	FloatType,
	ClampToEdgeWrapping,
} from 'three';
import { createDataTexture } from '@utils/webgl';

export default class FBO {
	constructor({
		tWidth = 512,
		tHeight = 512,
		numTargets = 3,
		filterType = NearestFilter,
		format = RGBAFormat,
		renderer,
		uniforms,
		simulationVertexShader,
		simulationFragmentShader,
	} = {}) {
		this.tWidth = tWidth;
		this.tHeight = tHeight;
		this.numTargets = numTargets;
		this.filterType = filterType;
		this.format = format;
		this.renderer = renderer;

		this.simulationShader = new ShaderMaterial({
			vertexShader: simulationVertexShader,
			fragmentShader: simulationFragmentShader,
			uniforms: Object.assign({}, uniforms, {
				numFrames: { type: 'f', value: 60 },
				tPrev: { type: 't', value: null },
				tCurr: { type: 't', value: null },
				delta: { type: 't', value: null },
			}),
		});

		this.cameraRTT = new OrthographicCamera(
			-tWidth / 2,
			tWidth / 2,
			tHeight / 2,
			-tHeight / 2,
			-1000,
			1000,
		);
		this.cameraRTT.position.z = 0.1;

		this.sceneRTTPos = new Scene();
		this.sceneRTTPos.add(this.cameraRTT);

		this.floatType = this.getType();
		this.targets = [];

		for (let i = 0; i < this.numTargets; i++) {
			this.targets.push(this.createTarget());
		}

		this.plane = new PlaneGeometry(tWidth, tHeight);
		const quad = new Mesh(this.plane, this.simulationShader);
		this.sceneRTTPos.add(quad);

		this.count = -1;
	}

	// Tests if rendering to float render targets is available
	// FloatType not available on ios
	getType() {
		this.renderTarget = new WebGLRenderTarget(16, 16, {
			format: RGBAFormat,
			type: FloatType,
		});
		this.renderer.render(
			this.sceneRTTPos,
			this.cameraRTT,
			this.renderTarget,
		);
		const gl = this.renderer.context;
		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status !== gl.FRAMEBUFFER_COMPLETE) {
			console.log('FloatType not supported');
			return HalfFloatType;
		}
		return FloatType;
	}

	createTarget() {
		this.target = new WebGLRenderTarget(this.tWidth, this.tHeight, {
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
			minFilter: this.filterType,
			magFilter: this.filterType,
			format: this.format,
			type: this.floatType,
		});
		this.target.texture.generateMipmaps = false;

		return this.target;
	}

	setTextureUniform(name, data) {
		const dataTexture = createDataTexture({
			data,
			tWidth: this.tWidth,
			tHeight: this.tHeight,
			format: this.format,
			filterType: this.filterType,
		});

		if (typeof name === 'object') {
			name.forEach((sName) => {
				this.simulationShader.uniforms[sName].value = dataTexture;
			});
		} else {
			this.simulationShader.uniforms[name].value = dataTexture;
		}
	}

	render(delta) {
		this.count++;

		if (this.count === this.numTargets) {
			this.count = 0;
		}

		const prev = (this.count === 0 ? this.numTargets : this.count) - 1;
		const prevTarget = this.targets[prev];

		this.renderer.render(
			this.sceneRTTPos,
			this.cameraRTT,
			this.getCurrentFrame(),
		);

		this.simulationShader.uniforms.tPrev.value = prevTarget;
		this.simulationShader.uniforms.delta.value = delta;
		this.simulationShader.uniforms.tCurr.value = this.getCurrentFrame();
	}

	getCurrentFrame() {
		return this.targets[this.count];
	}

	destroy() {
		this.renderTarget.dispose();
		this.target.dispose();
	}
}
