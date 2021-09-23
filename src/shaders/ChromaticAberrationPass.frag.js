// Based on https://www.shadertoy.com/view/ltKBDd by battlebottle

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uRedOffset;
uniform float uGreenOffset;
uniform float uBlueOffset;
uniform float uIntensity;

in vec2 vUv;

out vec4 FragColor;

void main() {
    float ro = uRedOffset * uIntensity;
    float go = uGreenOffset * uIntensity;
    float bo = uBlueOffset * uIntensity;

    float r = texture(tMap, vUv * (1.0 + ro) - (ro / 2.0)).r;
    float g = texture(tMap, vUv * (1.0 + go) - (go / 2.0)).g;
    float b = texture(tMap, vUv * (1.0 + bo) - (bo / 2.0)).b;

    FragColor = vec4(r, g, b, 1.0);
}
`;
