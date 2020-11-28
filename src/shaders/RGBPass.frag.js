import rgbshift from './modules/rgbshift/rgbshift.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uDistortion;
uniform float uTime;

varying vec2 vUv;

${rgbshift}

void main() {
    float angle = length(vUv - vec2(0.5));
    float amount = uDistortion * cos(uTime) + 0.0002;

    gl_FragColor = getRGB(tMap, vUv, angle, amount);
}
`;
