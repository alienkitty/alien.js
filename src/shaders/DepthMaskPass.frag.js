export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tDepth1;
uniform sampler2D tDepth2;

in vec2 vUv;

out vec4 FragColor;

void main() {
    float d1 = texture(tDepth1, vUv).r;
    float d2 = texture(tDepth2, vUv).r;

    if (d1 < d2) {
        discard;
    }

    FragColor = texture(tMap, vUv);
}
`;
