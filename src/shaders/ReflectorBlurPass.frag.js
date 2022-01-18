// Based on {@link module:three/examples/jsm/shaders/HorizontalTiltShiftShader.js} by alteredq
// Based on https://github.com/spite/codevember-2016

import smootherstep from './modules/smootherstep/smootherstep.glsl.js';
import blur13 from './modules/blur/blur13.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uBluriness;
uniform vec2 uDirection;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${smootherstep}
${blur13}

void main() {
    FragColor = blur13(tMap, vUv, uResolution, smootherstep(uBluriness, 0.0, vUv.y) * uDirection);
}
`;
