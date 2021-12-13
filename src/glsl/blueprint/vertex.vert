/* example */
// #pragma glslify: functionName = require(../../utils/glsl/templateFunction.glsl)

precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;

varying vec2 vUv;
varying vec3 vPos;

void main() {
	vUv = uv;
	vPos = position;
	vec3 pos = position;

	vec4 mv = modelViewMatrix * vec4(pos, 1.);
	gl_Position = projectionMatrix * mv;
	// gl_PointSize = 1. / -mv.z; // for Points Mesh
}
