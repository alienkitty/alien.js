// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/LUTPass.js by gkjohnson

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
precision highp sampler3D;

uniform sampler2D tMap;
uniform sampler3D tLut;
uniform float uLutSize;
uniform float uIntensity;

in vec2 vUv;

out vec4 FragColor;

void main() {
    vec4 val = texture(tMap, vUv);
    vec4 lutVal;

    // Pull the sample in by half a pixel so the sample begins
    // at the center of the edge pixels.
    float pixelWidth = 1.0 / uLutSize;
    float halfPixelWidth = 0.5 / uLutSize;
    vec3 uvw = vec3(halfPixelWidth) + val.rgb * (1.0 - pixelWidth);

    lutVal = vec4(texture(tLut, uvw).rgb, val.a);

    FragColor = vec4(mix(val, lutVal, uIntensity));
}
`;
