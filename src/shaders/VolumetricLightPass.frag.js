// Based on https://github.com/BKcore/Three.js-experiments-pool
// Based on https://github.com/netpraxis/volumetric_light_example
// Based on https://codepen.io/peterhry/pen/egzjGR

export default /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform vec2 uLightPosition;
uniform vec2 uScale;
uniform float uSwizzle;
uniform float uExposure;
uniform float uDecay;
uniform float uDensity;
uniform float uWeight;
uniform float uClamp;

in vec2 vUv;

out vec4 FragColor;

const int samples = 20;

void main() {
    vec2 texCoord = vUv;
    vec2 deltaTextCoord = texCoord - uLightPosition;
    deltaTextCoord *= 1.0 / float(samples) * uDensity;
    vec4 color = vec4(0);
    float illuminationDecay = 1.0;

    for (int i = 0; i < samples; i++) {
        texCoord -= ((deltaTextCoord.xy * (1.0 - uSwizzle)) + (deltaTextCoord.xx * uSwizzle)) * uScale;
        vec4 texel = texture(tMap, texCoord);
        texel *= illuminationDecay * uWeight;
        color += texel;
        illuminationDecay *= uDecay;
    }

    color *= uExposure;
    color = clamp(color, 0.0, uClamp);

    FragColor = color;
}
`;
