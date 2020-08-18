export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uAlpha;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(tMap, vUv);
    gl_FragColor.a *= uAlpha;
}
`;
