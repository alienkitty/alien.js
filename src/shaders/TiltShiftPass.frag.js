// Based on {@link module:three/examples/jsm/shaders/HorizontalTiltShiftShader.js} by alteredq
// Based on https://github.com/spite/codevember-2016

import smootherstep from './modules/smootherstep/smootherstep.glsl.js';
import blur from './modules/blur/blur.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uBluriness;
uniform vec2 uDirection;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${smootherstep}
${blur}

void main() {
    float d = abs(0.5 - vUv.y);

    FragColor = blur(tMap, vUv, uResolution, uBluriness * smootherstep(0.0, 1.0, d) * uDirection);
}
`;
