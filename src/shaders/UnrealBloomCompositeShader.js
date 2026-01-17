// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/UnrealBloomPass.js by spidersharma03 and bhouston

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

uniform sampler2D tBlur1;
uniform sampler2D tBlur2;
uniform sampler2D tBlur3;
uniform sampler2D tBlur4;
uniform sampler2D tBlur5;
uniform float uBloomStrength;
uniform float uBloomRadius;
uniform float uBloomFactors[NUM_MIPS];
uniform vec3 uBloomTintColors[NUM_MIPS];

in vec2 vUv;

out vec4 FragColor;

float lerpBloomFactor(float factor) {
    return mix(factor, 1.2 - factor, uBloomRadius);
}

void main() {
    vec3 bloom = 3.0 * uBloomStrength * (
        lerpBloomFactor(uBloomFactors[0]) * uBloomTintColors[0] * texture(tBlur1, vUv).rgb +
        lerpBloomFactor(uBloomFactors[1]) * uBloomTintColors[1] * texture(tBlur2, vUv).rgb +
        lerpBloomFactor(uBloomFactors[2]) * uBloomTintColors[2] * texture(tBlur3, vUv).rgb +
        lerpBloomFactor(uBloomFactors[3]) * uBloomTintColors[3] * texture(tBlur4, vUv).rgb +
        lerpBloomFactor(uBloomFactors[4]) * uBloomTintColors[4] * texture(tBlur5, vUv).rgb
    );

    float bloomAlpha = max(bloom.r, max(bloom.g, bloom.b));

    FragColor = vec4(bloom, bloomAlpha);
}
`;
