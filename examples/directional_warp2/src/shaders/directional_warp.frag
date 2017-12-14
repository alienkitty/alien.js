// Based on https://gl-transitions.com/editor/directionalwarp by pschroen

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float opacity;
uniform float progress;
uniform vec2 direction;

varying vec2 vUv;

const float smoothness = 0.5;
const vec2 center = vec2(0.5, 0.5);

void main() {
    vec2 v = normalize(direction);
    v /= abs(v.x) + abs(v.y);
    float d = v.x * center.x + v.y * center.y;
    float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * vUv.x + v.y * vUv.y - (d - 0.5 + progress * (1.0 + smoothness)));
    gl_FragColor = mix(texture2D(texture1, (vUv - 0.5) * (1.0 - m) + 0.5), texture2D(texture2, (vUv - 0.5) * m + 0.5), m);
}
