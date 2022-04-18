// Based on {@link module:three/examples/jsm/shaders/LuminosityHighPassShader.js} by bhouston

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uThreshold;
uniform float uSmoothing;

in vec2 vUv;

out vec4 FragColor;

void main() {
    vec4 texel = texture(tMap, vUv);
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float v = dot(texel.xyz, luma);
    float alpha = smoothstep(uThreshold, uThreshold + uSmoothing, v);

    FragColor = mix(vec4(0), texel, alpha);
}
`;
