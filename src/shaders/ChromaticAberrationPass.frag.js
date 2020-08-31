// Based on https://www.shadertoy.com/view/ltKBDd by battlebottle

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uIntensity;

varying vec2 vUv;

void main() {
    float ro = -0.0015 * uIntensity;
    float bo = 0.0015 * uIntensity;

    float r = texture2D(tMap, vUv * (1.0 + ro) - (ro / 2.0)).r;
    float g = texture2D(tMap, vUv).g;
    float b = texture2D(tMap, vUv * (1.0 + bo) - (bo / 2.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}
`;
