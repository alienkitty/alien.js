// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/LuminosityHighPassShader.js by bhouston

import luminance from './modules/luminance/luminance.glsl.js';

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
uniform float uThreshold;
uniform float uSmoothing;

in vec2 vUv;

out vec4 FragColor;

${luminance}

void main() {
    vec4 texel = texture(tMap, vUv);
    float v = luminance(texel.xyz);
    float alpha = smoothstep(uThreshold, uThreshold + uSmoothing, v);

    FragColor = mix(vec4(0), texel, alpha);
}
`;
