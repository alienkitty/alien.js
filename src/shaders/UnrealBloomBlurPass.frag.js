import blur from './modules/blur/unreal-blur.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uDirection;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${blur}

void main() {
    FragColor = blur(tMap, vUv, uResolution, uDirection);
}
`;
