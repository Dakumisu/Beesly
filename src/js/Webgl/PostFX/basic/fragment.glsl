precision highp float;

#ifdef FXAA
	#pragma glslify: fxaa = require(philbin-packages/glsl/fxaa/index.glsl)
#endif

uniform bool POST_PROCESSING;
uniform sampler2D uScene;
uniform vec3 uResolution;

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution.xy;
	uv /= uResolution.z;

	vec3 render = vec3(0., 0., 0.);

	#ifdef FXAA
	render = fxaa(uScene, gl_FragCoord.xy / uResolution.z, uResolution.xy).rgb;
	#else
	render = texture2D(uScene, uv).rgb;
	#endif

	if(POST_PROCESSING) {
		// your post pro stuff here...
	}

	gl_FragColor = vec4(render, 1.0);
}
