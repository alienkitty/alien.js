import rgbshift from './modules/rgbshift/rgbshift.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uAngle;
uniform float uAmount;

in vec2 vUv;

out vec4 FragColor;

${rgbshift}

void main() {
    FragColor = getRGB(tMap, vUv, uAngle, uAmount);
}
`;
