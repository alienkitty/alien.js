import spherize from './modules/spherize/spherize.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uDirection;

varying vec2 vUv;

${spherize}

void main() {
    gl_FragColor = spherize(tMap, vUv, uDirection);
}
`;
