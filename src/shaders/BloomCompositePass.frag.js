import blueNoise from './modules/noise/blue-noise.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tBlur1;
uniform sampler2D tBlur2;
uniform sampler2D tBlur3;
uniform sampler2D tBlur4;
uniform sampler2D tBlur5;
uniform sampler2D tBlueNoise;
uniform vec2 uBlueNoiseTexelSize;
uniform float uBloomFactors[NUM_MIPS];

varying vec2 vUv;

${blueNoise}

void main() {
    gl_FragColor = uBloomFactors[0] * texture2D(tBlur1, vUv) +
                   uBloomFactors[1] * texture2D(tBlur2, vUv) +
                   uBloomFactors[2] * texture2D(tBlur3, vUv) +
                   uBloomFactors[3] * texture2D(tBlur4, vUv) +
                   uBloomFactors[4] * texture2D(tBlur5, vUv);

    float blueNoise = getBlueNoise(tBlueNoise, gl_FragCoord.xy, uBlueNoiseTexelSize);

    gl_FragColor.rgb += blueNoise / 128.0;
    gl_FragColor.a = 1.0;
}
`;
