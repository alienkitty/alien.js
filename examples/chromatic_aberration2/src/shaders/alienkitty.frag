#pragma glslify: chromatic_aberration = require('./chromatic-aberration')

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float opacity;
uniform float progress;

varying vec2 vUv;

void main() {
    vec4 rgba = chromatic_aberration(texture, vUv, progress);
    rgba.a *= opacity;
    gl_FragColor = rgba;
}
