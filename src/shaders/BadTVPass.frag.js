import badtv from './modules/badtv/badtv.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uDistortion;
uniform float uDistortion2;
uniform float uSpeed;
uniform float uRollSpeed;
uniform float uTime;

in vec2 vUv;

out vec4 FragColor;

${badtv}

void main() {
    FragColor = getBadTV(tMap, vUv, uTime, uDistortion, uDistortion2, uSpeed, uRollSpeed);
}
`;
