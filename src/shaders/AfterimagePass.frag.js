// Based on {@link module:three/examples/jsm/shaders/AfterimageShader.js} by HypnosNova

import when_gt from './modules/conditionals/when_gt.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tOld;
uniform sampler2D tNew;
uniform float uDamping;

in vec2 vUv;

out vec4 FragColor;

${when_gt}

void main() {
    vec4 texelOld = texture(tOld, vUv);
    vec4 texelNew = texture(tNew, vUv);

    texelOld *= uDamping * when_gt(texelOld, vec4(0.1));

    FragColor = max(texelNew, texelOld);
}
`;
