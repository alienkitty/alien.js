// Based on {@link module:three/examples/jsm/shaders/LuminosityHighPassShader.js} by bhouston

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uLuminosityThreshold;
uniform float uSmoothWidth;
uniform vec3 uDefaultColor;
uniform float uDefaultOpacity;

varying vec2 vUv;

void main() {
    vec4 texel = texture2D(tMap, vUv);
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float v = dot(texel.xyz, luma);
    vec4 outputColor = vec4(uDefaultColor.rgb, uDefaultOpacity);
    float alpha = smoothstep(uLuminosityThreshold, uLuminosityThreshold + uSmoothWidth, v);

    gl_FragColor = mix(outputColor, texel, alpha);
}
`;
