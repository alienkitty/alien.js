// Based on https://github.com/mattdesl/glsl-fxaa

import fxaa from './modules/fxaa/fxaa.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uResolution;

in vec2 v_rgbNW;
in vec2 v_rgbNE;
in vec2 v_rgbSW;
in vec2 v_rgbSE;
in vec2 v_rgbM;

in vec2 vUv;

out vec4 FragColor;

${fxaa}

void main() {
    FragColor = fxaa(tMap, vUv * uResolution, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
`;
