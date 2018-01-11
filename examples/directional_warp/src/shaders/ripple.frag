// Based on https://gl-transitions.com/editor/ripple by gre

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float opacity;
uniform float progress;
uniform vec2 direction;

varying vec2 vUv;

const float amplitude = 100.0;
const float speed = 10.0;
const vec2 center = vec2(0.5, 0.5);

void main() {
    vec2 v = normalize(direction);
    v /= abs(v.x) + abs(v.y);
    float d = v.x * center.x * vUv.x + v.y * center.y * vUv.y;
    vec2 dir = vUv / 2.0;
    vec2 offset = dir * (sin((1.0 - progress) * d * amplitude - (1.0 - progress) * speed) + 0.5) / 30.0;
    vec4 rgba = texture2D(texture, vUv + offset);
    rgba.a *= opacity;
    gl_FragColor = rgba;
}
