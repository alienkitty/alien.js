#pragma glslify: chromatic_aberration = require('./chromatic-aberration')

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float distortion;

varying vec2 vUv;

void main() {
    gl_FragColor = chromatic_aberration(texture, vUv, distortion);
}
