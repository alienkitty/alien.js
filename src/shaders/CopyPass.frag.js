export default /* glsl */`
precision highp float;

uniform sampler2D tMap;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(tMap, vUv);
}
`;
