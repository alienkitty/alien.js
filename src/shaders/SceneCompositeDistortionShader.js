import rgbshift from './modules/rgbshift/rgbshift.glsl.js';
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
uniform float uBloomDistortion;

in vec2 vUv;

out vec4 FragColor;

${rgbshift}
${dither}

void main() {
    FragColor = texture(tScene, vUv);

    vec2 dir = 0.5 - vUv;
    float angle = atan(dir.y, dir.x);
    float amount = 0.001 * uBloomDistortion;

    FragColor.rgb += getRGB(tBloom, vUv, angle, amount).rgb;

    #ifdef DITHERING
        FragColor.rgb = dither(FragColor.rgb);
    #endif

    FragColor.a = 1.0;
}
`;
