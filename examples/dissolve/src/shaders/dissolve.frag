// Based on https://www.shadertoy.com/view/4s3GWj by NemoKradXNA

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float opacity;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    gl_FragColor = mix(texture2D(texture2, uv), texture2D(texture1, uv), opacity);
}
