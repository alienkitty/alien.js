// Based on https://www.shadertoy.com/view/4sX3Rs by mu6k
// Based on https://www.shadertoy.com/view/wlcyzj by TheNosiriN

export default /* glsl */ `
precision highp float;

uniform vec2 uLightPosition;
uniform vec3 uColor;
uniform float uExposure;
uniform float uClamp;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 FragColor;

vec3 lensflare(vec2 uv, vec2 pos) {
    vec2 uvd = uv * length(uv);

    float f21 = max(1.0 / (1.0 + 32.0 * pow(length(uvd + 0.8 * pos), 2.0)), 0.0) * 0.25;
    float f22 = max(1.0 / (1.0 + 32.0 * pow(length(uvd + 0.85 * pos), 2.0)), 0.0) * 0.23;
    float f23 = max(1.0 / (1.0 + 32.0 * pow(length(uvd + 0.9 * pos), 2.0)), 0.0) * 0.21;

    vec2 uvx = mix(uv, uvd, -0.5);
    float f41 = max(0.01 - pow(length(uvx + 0.4 * pos), 2.4), 0.0) * 6.0;
    float f42 = max(0.01 - pow(length(uvx + 0.45 * pos), 2.4), 0.0) * 5.0;
    float f43 = max(0.01 - pow(length(uvx + 0.5 * pos), 2.4), 0.0) * 3.0;

    uvx = mix(uv, uvd, -0.4);
    float f51 = max(0.01 - pow(length(uvx + 0.2 * pos), 5.5), 0.0) * 2.0;
    float f52 = max(0.01 - pow(length(uvx + 0.4 * pos), 5.5), 0.0) * 2.0;
    float f53 = max(0.01 - pow(length(uvx + 0.6 * pos), 5.5), 0.0) * 2.0;

    uvx = mix(uv, uvd, -0.5);
    float f61 = max(0.01 - pow(length(uvx - 0.3 * pos), 1.6), 0.0) * 6.0;
    float f62 = max(0.01 - pow(length(uvx - 0.325 * pos), 1.6), 0.0) * 3.0;
    float f63 = max(0.01 - pow(length(uvx - 0.35 * pos), 1.6), 0.0) * 5.0;

    return vec3(f21 + f41 + f51 + f61, f22 + f42 + f52 + f62, f23 + f43 + f53 + f63);
}

void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;
    vec2 pos = uLightPosition - 0.5;
    pos.x *= uResolution.x / uResolution.y;

    vec3 color = lensflare(uv * 1.5, pos * 1.5) * uColor * 2.0;
    color = pow(color, vec3(0.5));
    color *= uExposure;
    color = clamp(color, 0.0, uClamp);

    FragColor = vec4(color, 1.0);
}
`;
