import blur13 from './modules/blur/blur13.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uBluriness;
uniform vec2 uDirection;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${blur13}

void main() {
    FragColor = blur13(tMap, vUv, uResolution, smoothstep(0.5 + uBluriness * 0.5, 0.0, vUv.y) * uDirection);
}
`;
