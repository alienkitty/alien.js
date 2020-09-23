// Based on https://github.com/mattdesl/glsl-fxaa

import fxaa from './modules/fxaa/fxaa.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uResolution;

varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vUv;

${fxaa}

void main() {
    gl_FragColor = fxaa(tMap, vUv * uResolution, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
`;
