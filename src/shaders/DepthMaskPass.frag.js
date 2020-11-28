export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tDepth1;
uniform sampler2D tDepth2;

varying vec2 vUv;

void main() {
    float d1 = texture2D(tDepth1, vUv).r;
    float d2 = texture2D(tDepth2, vUv).r;

    if (d1 < d2) {
        discard;
    }

    gl_FragColor = texture2D(tMap, vUv);
}
`;
