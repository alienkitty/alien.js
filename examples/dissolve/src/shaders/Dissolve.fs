// Based on https://www.shadertoy.com/view/4s3GWj by NemoKradXNA

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform float iAlpha;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    gl_FragColor = mix(texture2D(iChannel1, uv), texture2D(iChannel0, uv), iAlpha);
}
