precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uAlpha;
uniform vec3 uColor;
uniform vec3 uResolution;

varying float vLoop;
varying float vRandomScale;
varying vec2 vUv;

void main() {
	vec2 uv = vUv;

	float time = uTime * .001;
	float smoothLoop = smoothstep(1., .75, vLoop) * smoothstep(.0, .25, vLoop);

	vec2 res = gl_FragCoord.xy / uResolution.xy;
	res /= uResolution.z;

	float strength = .5 * (vRandomScale * .5) / distance(uv, vec2(.5));

	vec3 particle = vec3(uColor);
	particle *= strength;
	particle *= smoothstep(1., 10., particle);

	float alpha = uAlpha;
	alpha *= smoothLoop;
	alpha *= vRandomScale;

	gl_FragColor = vec4(particle, alpha);
}
