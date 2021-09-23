import blur13 from './modules/blur/blur13.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uDirection;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${blur13}

void main() {
    FragColor = blur13(tMap, vUv, uResolution, uDirection);
}
`;
