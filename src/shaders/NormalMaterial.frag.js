export default /* glsl */`
precision highp float;

in vec3 vNormal;

out vec4 FragColor;

void main() {
    FragColor = vec4(vNormal, 1.0);
}
`;
