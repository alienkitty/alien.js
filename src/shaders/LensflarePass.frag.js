// Based on https://www.shadertoy.com/view/4sX3Rs by mu6k
// Based on https://www.shadertoy.com/view/XdfXRX by Icecool
// Based on https://www.shadertoy.com/view/wlcyzj by TheNosiriN

import blueNoise from './modules/noise/blue-noise.glsl.js';

export default /* glsl */ `
precision highp float;

uniform sampler2D tBlueNoise;
uniform vec2 uBlueNoiseResolution;
uniform vec2 uLightPosition;
uniform float uExposure;
uniform float uClamp;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

${blueNoise}

float noise(float t) {
    return getBlueNoise(tBlueNoise, vec2(t, 0.0), uBlueNoiseResolution);
}

float noise(vec2 t) {
    return getBlueNoise(tBlueNoise, t, uBlueNoiseResolution);
}

vec3 lensflare(vec2 uv, vec2 pos) {
    vec2 main = uv - pos;
    vec2 uvd = uv * length(uv);

    float ang = atan(main.x, main.y);
    float dist = length(main);
    dist = pow(dist, 0.1);
    float n = noise(vec2(ang * 16.0, dist * 32.0));

    float f0 = 1.0 / (length(uv - pos) * 16.0 + 1.0);

    f0 = f0 + f0 * (sin(noise(sin(ang * 2.0 + pos.x) * 4.0 - cos(ang * 3.0 + pos.y)) * 16.0) * 0.1 + dist * 0.1 + 0.8);

    float f1 = max(0.01 - pow(length(uv + 1.2 * pos), 1.9), 0.0) * 7.0;

    float f2 = max(1.0 / (1.0 + 32.0 * pow(length(uvd + 0.8 * pos), 2.0)), 0.0) * 00.25;
    float f22 = max(1.0 / (1.0 + 32.0 * pow(length(uvd + 0.85 * pos), 2.0)), 0.0) * 00.23;
    float f23 = max(1.0 / (1.0 + 32.0 * pow(length(uvd + 0.9 * pos), 2.0)), 0.0) * 00.21;

    vec2 uvx = mix(uv, uvd, -0.5);

    float f4 = max(0.01 - pow(length(uvx + 0.4 * pos), 2.4), 0.0) * 6.0;
    float f42 = max(0.01 - pow(length(uvx + 0.45 * pos), 2.4), 0.0) * 5.0;
    float f43 = max(0.01 - pow(length(uvx + 0.5 * pos), 2.4), 0.0) * 3.0;

    uvx = mix(uv, uvd, -0.4);

    float f5 = max(0.01 - pow(length(uvx + 0.2 * pos), 5.5), 0.0) * 2.0;
    float f52 = max(0.01 - pow(length(uvx + 0.4 * pos), 5.5), 0.0) * 2.0;
    float f53 = max(0.01 - pow(length(uvx + 0.6 * pos), 5.5), 0.0) * 2.0;

    uvx = mix(uv, uvd, -0.5);

    float f6 = max(0.01 - pow(length(uvx - 0.3 * pos), 1.6), 0.0) * 6.0;
    float f62 = max(0.01 - pow(length(uvx - 0.325 * pos), 1.6), 0.0) * 3.0;
    float f63 = max(0.01 - pow(length(uvx - 0.35 * pos), 1.6), 0.0) * 5.0;

    vec3 c = vec3(0.0);

    c.r += f2 + f4 + f5 + f6;
    c.g += f22 + f42 + f52 + f62;
    c.b += f23 + f43 + f53 + f63;
    c = c * 1.3 - vec3(length(uvd) * 0.05);
    c += vec3(f0);

    return c;
}

vec3 cc(vec3 color, float factor, float factor2) {
    float w = color.x + color.y + color.z;
    return mix(color, vec3(w) * factor, w * factor2);
}

void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;
    vec2 mouse = uLightPosition - 0.5;
    mouse.x *= uResolution.x / uResolution.y;

    vec3 color = vec3(1.4, 1.2, 1.0) * lensflare(uv, mouse.xy);
    color -= noise(gl_FragCoord.xy) * 0.015;
    color = cc(color, 0.5, 0.1);

    color *= uExposure;
    color = clamp(color, 0.0, uClamp);

    FragColor = vec4(color, 1.0);
}
`;
