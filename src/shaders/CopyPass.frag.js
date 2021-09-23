export default /* glsl */`
precision highp float;

uniform sampler2D tMap;

in vec2 vUv;

out vec4 FragColor;

void main() {
    FragColor = texture(tMap, vUv);
}
`;
