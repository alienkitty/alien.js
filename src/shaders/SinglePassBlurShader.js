import blur from './modules/blur/blur.glsl.js';

export const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform float uBlurAmount;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${blur}

void main() {
    vec4 blur1 = blur(tMap, vUv, uResolution, vec2(uBlurAmount, 0.0)) * 0.5;
    vec4 blur2 = blur(tMap, vUv, uResolution, vec2(0.0, uBlurAmount)) * 0.5;

    FragColor = blur1 + blur2;
}
`;
