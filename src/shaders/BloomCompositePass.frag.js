import dither from './modules/dither/dither.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tBlur1;
uniform sampler2D tBlur2;
uniform sampler2D tBlur3;
uniform sampler2D tBlur4;
uniform sampler2D tBlur5;
uniform float uBloomFactors[NUM_MIPS];

in vec2 vUv;

out vec4 FragColor;

${dither}

void main() {
    FragColor = uBloomFactors[0] * texture(tBlur1, vUv) +
                uBloomFactors[1] * texture(tBlur2, vUv) +
                uBloomFactors[2] * texture(tBlur3, vUv) +
                uBloomFactors[3] * texture(tBlur4, vUv) +
                uBloomFactors[4] * texture(tBlur5, vUv);

    FragColor.rgb = dither(FragColor.rgb);
}
`;
