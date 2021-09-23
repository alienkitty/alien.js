export default /* glsl */`
precision highp float;

uniform sampler2D tScene;
uniform sampler2D tBloom;

in vec2 vUv;

out vec4 FragColor;

void main() {
    FragColor = texture(tScene, vUv);

    FragColor.rgb += texture(tBloom, vUv).rgb;
}
`;
