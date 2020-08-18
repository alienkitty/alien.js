// Based on {@link module:three/examples/jsm/postprocessing/UnrealBloomPass.js} by spidersharma and bhouston

export default /* glsl */`
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

varying vec2 vUv;

float lerpBloomFactor(float factor) {
    return mix(factor, 1.2 - factor, uBloomRadius);
}

void main() {
    gl_FragColor = uBloomStrength * (lerpBloomFactor(uBloomFactors[0]) * vec4(uBloomTintColors[0], 1.0) * texture2D(tBlur1, vUv) +
                                     lerpBloomFactor(uBloomFactors[1]) * vec4(uBloomTintColors[1], 1.0) * texture2D(tBlur2, vUv) +
                                     lerpBloomFactor(uBloomFactors[2]) * vec4(uBloomTintColors[2], 1.0) * texture2D(tBlur3, vUv) +
                                     lerpBloomFactor(uBloomFactors[3]) * vec4(uBloomTintColors[3], 1.0) * texture2D(tBlur4, vUv) +
                                     lerpBloomFactor(uBloomFactors[4]) * vec4(uBloomTintColors[4], 1.0) * texture2D(tBlur5, vUv));
}
`;
