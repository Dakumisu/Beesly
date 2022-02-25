precision highp float;

uniform sampler2D uScene;
uniform vec3 uResolution;

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution.xy;
	uv /= uResolution.z;

	vec3 render = texture2D(uScene, uv).rgb;

	gl_FragColor = vec4(render, 1.0);
}
