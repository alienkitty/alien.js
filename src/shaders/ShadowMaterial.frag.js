export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uAlpha;

in vec2 vUv;

out vec4 FragColor;

void main() {
    float shadow = texture(tMap, vUv).g;

    FragColor.rgb = vec3(0.0);
    FragColor.a = shadow * uAlpha;
}
`;
