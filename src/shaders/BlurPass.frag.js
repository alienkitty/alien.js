import blur from './modules/blur/blur.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uBluriness;
uniform vec2 uDirection;
uniform vec2 uResolution;

varying vec2 vUv;

${blur}

void main() {
    gl_FragColor = blur(tMap, vUv, uResolution, uBluriness * uDirection);
}
`;
