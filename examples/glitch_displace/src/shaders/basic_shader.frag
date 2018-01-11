uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float opacity;

varying vec2 vUv;

void main() {
    vec4 rgba = texture2D(texture, vUv);
    rgba.a *= opacity;
    gl_FragColor = rgba;
}
