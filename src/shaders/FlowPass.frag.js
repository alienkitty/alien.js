// Based on https://oframe.github.io/ogl/examples/?src=mouse-flowmap.html by gordonnl

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tFlow;

varying vec2 vUv;

void main() {
    // R and G values are velocity in the X and Y direction
    // B value is the velocity length
    vec3 flow = texture2D(tFlow, vUv).rgb;

    // Use flow to adjust the UV lookup of a texture
    vec2 uv = vUv;
    uv += flow.rg * 0.05;

    gl_FragColor = texture2D(tMap, uv);
}
`;
