import blur from './modules/blur/unreal-blur.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uDirection;
uniform vec2 uResolution;

varying vec2 vUv;

${blur}

void main() {
    gl_FragColor = blur(tMap, vUv, uResolution, uDirection, KERNEL_RADIUS, SIGMA);
}
`;
