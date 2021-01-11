import rgbshift from './modules/rgbshift/rgbshift.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uAngle;
uniform float uAmount;

varying vec2 vUv;

${rgbshift}

void main() {
    gl_FragColor = getRGB(tMap, vUv, uAngle, uAmount);
}
`;
