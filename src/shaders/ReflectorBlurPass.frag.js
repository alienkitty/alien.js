import blur13 from './modules/blur/blur13.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uDirection;
uniform vec2 uResolution;

varying vec2 vUv;

${blur13}

void main() {
    gl_FragColor = blur13(tMap, vUv, uResolution, uDirection * (1.0 - vUv.y));
}
`;
