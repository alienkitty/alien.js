// Based on https://oframe.github.io/ogl/examples/?src=msdf-text.html by gordonnl

export default /* glsl */`
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform sampler2D tMap;
uniform vec3 uColor;
uniform float uAlpha;

varying vec2 vUv;

void main() {
    vec3 tex = texture2D(tMap, vUv).rgb;
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);

    if (alpha < 0.01) discard;

    gl_FragColor.rgb = uColor;
    gl_FragColor.a = alpha * uAlpha;
}
`;
