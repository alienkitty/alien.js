uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iAlpha;

varying vec2 vUv;

void main() {
    vec4 rgba = texture2D(iChannel0, vUv);
    rgba.a *= iAlpha;
    gl_FragColor = rgba;
}
