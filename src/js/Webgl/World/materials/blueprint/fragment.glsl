precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uAlpha;
uniform vec2 uAspect;
uniform vec3 uColor;
uniform vec3 uResolution;

varying vec2 vUv;

void main() {
	// in the case of an orthographic camera, so that the image keeps its aspect (uResolution must be a vec4)
	// vec2 newUv = (vUv - vec2(.5)) * uResolution.vy + vec2(.5);
	vec2 uv = vUv;
	float time = uTime * .001;

	vec3 color = vec3(uColor);

	gl_FragColor = vec4(uv, 0., uAlpha);
}
