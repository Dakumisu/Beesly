precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;

attribute vec3 aPositions;
attribute float aOffset;
attribute float aRandomScale;

varying float vLoop;
varying float vRandomScale;
varying vec2 vUv;
varying vec3 vPos;

const float maxDuration = 10.;

void main() {
	vUv = uv;
	vRandomScale = aRandomScale;
	vPos = position;
	vec3 pos = position;

	vec3 spherePos = pos + aPositions;

	float loop = mod((uTime * .001) + aOffset * maxDuration, maxDuration) / maxDuration;
	vLoop = loop;

	spherePos.x += (loop) * spherePos.x * (2. - (sin(uTime * .002 + (aOffset * 10.)) - 1.));
	spherePos.y += (loop) * spherePos.y * (3. - (sin(uTime * .002 + (aOffset * 5.))));

	vec4 mv = modelViewMatrix * vec4(spherePos, 1.);

	mv.xyz += pos.xyz * (PI * 2.); // Billboard

	gl_Position = projectionMatrix * mv;
}
