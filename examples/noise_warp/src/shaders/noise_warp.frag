// Based on https://www.shadertoy.com/view/Mslfz4 by DonKarlssonSan

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float opacity;

varying vec2 vUv;

#pragma glslify: snoise = require('glsl-noise/simplex/2d')

void main() {
    vec2 uv = vUv;
    uv.x += snoise(vec2(uv.x, time / 10.0)) / 10.0;
    uv.y += snoise(vec2(uv.y, time / 10.0 + 5555.0)) / 10.0;

    vec4 c0 = texture2D(texture1, uv);
    vec4 c1 = texture2D(texture2, uv);
    float t0 = time / 10.0;
    float t = snoise(vec2(t0, t0 + 1000.0));
    float m = snoise(uv + t);
    vec4 c = mix(c0, c1, m);
    gl_FragColor = c;
}
