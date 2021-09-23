// Based on https://oframe.github.io/ogl/examples/?src=msdf-text.html by gordonnl

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec3 uColor;
uniform float uAlpha;

in vec2 vUv;

out vec4 FragColor;

void main() {
    vec3 tex = texture(tMap, vUv).rgb;
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);

    if (alpha < 0.01) discard;

    FragColor.rgb = uColor;
    FragColor.a = alpha * uAlpha;
}
`;
