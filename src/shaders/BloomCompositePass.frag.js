// Based on {@link module:three/examples/jsm/postprocessing/UnrealBloomPass.js} by spidersharma and bhouston

import dither from './modules/dither/dither.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tBlur1;
uniform sampler2D tBlur2;
uniform sampler2D tBlur3;
uniform sampler2D tBlur4;
uniform sampler2D tBlur5;
uniform float uBloomFactors[NUM_MIPS];

varying vec2 vUv;

${dither}

void main() {
    gl_FragColor = uBloomFactors[0] * texture2D(tBlur1, vUv) +
                   uBloomFactors[1] * texture2D(tBlur2, vUv) +
                   uBloomFactors[2] * texture2D(tBlur3, vUv) +
                   uBloomFactors[3] * texture2D(tBlur4, vUv) +
                   uBloomFactors[4] * texture2D(tBlur5, vUv);

    gl_FragColor.rgb = dither(gl_FragColor.rgb);
    gl_FragColor.a = 1.0;
}
`;
