import blur from './modules/blur/blur.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uBluriness;
uniform vec2 uDirection;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${blur}

void main() {
    FragColor = blur(tMap, vUv, uResolution, uBluriness * uDirection);
}
`;
