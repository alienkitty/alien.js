export default /* glsl */`
precision highp float;

uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 1.0);
}
`;
