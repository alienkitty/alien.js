import dither from './modules/dither/dither.glsl.js';

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

uniform sampler2D tScene;
uniform sampler2D tBloom;
uniform sampler2D tAdd;

in vec2 vUv;

out vec4 FragColor;

${dither}

void main() {
    FragColor = texture(tScene, vUv);

    FragColor.rgb += texture(tBloom, vUv).rgb;

    FragColor.rgb += texture(tAdd, vUv).rgb;

    #ifdef DITHERING
        FragColor.rgb = dither(FragColor.rgb);
    #endif

    FragColor.a = 1.0;
}
`;
