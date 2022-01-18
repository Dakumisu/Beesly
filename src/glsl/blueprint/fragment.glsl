precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uAlpha;
uniform vec3 uColor;
// uniform vec4 uResolution;
uniform vec3 uResolution;

varying vec2 vUv;
varying vec3 vPos;

void main() {
	// in the case of an orthographic camera, so that the image keeps its aspect (uResolution must be a vec4)
	// vec2 newUv = (vUv - vec2(.5)) * uResolution.zw + vec2(.5);

	vec3 color = vec3(uColor);

	gl_FragColor = vec4(color, uAlpha);
	gl_FragColor = vec4(vUv, 0., uAlpha);
}
