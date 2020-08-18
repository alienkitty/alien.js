// Based on https://www.shadertoy.com/view/lsfGWn by hornet
// Based on https://github.com/spite/Wagner
// Based on https://github.com/spite/codevember-2016

import blur from './modules/blur/poisson-disc-blur27.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uRadius;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

float nrand(vec2 n) {
    return fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 rot2d(vec2 p, float a) {
    vec2 sc = vec2(sin(a), cos(a));
    return vec2(dot(p, vec2(sc.y, -sc.x)), dot(p, sc.xy));
}

${blur}

void main() {
    vec2 seed = vUv + fract(uTime);
    float rnd = 6.28 * nrand(seed);
    vec4 basis = vec4(rot2d(vec2(1, 0), rnd), rot2d(vec2(0, 1), rnd));

    gl_FragColor = poissonSample(tMap, vUv, uResolution, uRadius, basis);
}
`;
