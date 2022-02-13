precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;

attribute vec3 aPosition;
attribute float aOffset;
attribute float aScale;

varying float vLoop;
varying float vRandomScale;
varying vec2 vUv;

const float maxDuration = 10.;

void main() {
	vUv = uv;
	vRandomScale = aScale;
	vec3 pos = position;

	float time = uTime * .001;
	float offset = aOffset * aScale;

	vec3 particlePos = pos + aPosition;

	float loop = mod(time + abs(aOffset) * maxDuration, maxDuration) / maxDuration;
	vLoop = loop;

	// position = (position +/- end) +/- start
	// add variation with the offset, the scale or the time
	particlePos.x += loop * ((particlePos.x + (sin(time + aOffset) * aScale)) + (offset * .01));
	particlePos.y += loop * ((particlePos.y + (cos(time + aOffset) * aScale)) + (offset * .01));
	particlePos.z += loop * ((particlePos.z + (sin(time + aOffset) * aScale) * .01) + (offset * .01));

	vec4 mv = modelViewMatrix * vec4(particlePos, 1.);

	mv.xyz += pos.xyz * (PI * 2.); // Billboard

	gl_Position = projectionMatrix * mv;
}
