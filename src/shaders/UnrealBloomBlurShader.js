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
uniform vec2 uDirection;
uniform float uCoefficients[KERNEL_RADIUS];
uniform vec2 uTexelSize;

in vec2 vUv;

out vec4 FragColor;

void main() {
    float weightSum = uCoefficients[0];
    vec3 diffuseSum = texture(tMap, vUv).rgb * weightSum;

    for (int i = 1; i < KERNEL_RADIUS; i++) {
        float x = float(i);
        float w = uCoefficients[i];
        vec2 uvOffset = uDirection * uTexelSize * x;
        vec3 sample1 = texture(tMap, vUv + uvOffset).rgb;
        vec3 sample2 = texture(tMap, vUv - uvOffset).rgb;
        diffuseSum += (sample1 + sample2) * w;
    }

    FragColor = vec4(diffuseSum, 1.0);
}
`;
