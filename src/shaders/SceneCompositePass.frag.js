export default /* glsl */`
precision highp float;

uniform sampler2D tScene;
uniform sampler2D tBloom;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(tScene, vUv);

    gl_FragColor.rgb += texture2D(tBloom, vUv).rgb;
}
`;
