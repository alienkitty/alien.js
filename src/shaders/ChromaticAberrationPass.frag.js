// Based on https://www.shadertoy.com/view/ltKBDd by battlebottle

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uRedOffset;
uniform float uGreenOffset;
uniform float uBlueOffset;
uniform float uIntensity;

varying vec2 vUv;

void main() {
    float ro = uRedOffset * uIntensity;
    float go = uGreenOffset * uIntensity;
    float bo = uBlueOffset * uIntensity;

    float r = texture2D(tMap, vUv * (1.0 + ro) - (ro / 2.0)).r;
    float g = texture2D(tMap, vUv * (1.0 + go) - (go / 2.0)).g;
    float b = texture2D(tMap, vUv * (1.0 + bo) - (bo / 2.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}
`;
