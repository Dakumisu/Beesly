precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uAlpha;
uniform vec3 uColor;
uniform vec3 uResolution;

varying vec2 vUv;
varying vec3 vPos;

void main() {
  vec3 color = vec3(uColor);

  gl_FragColor = vec4(color, uAlpha);
  gl_FragColor = vec4(vUv, 0., uAlpha);
}