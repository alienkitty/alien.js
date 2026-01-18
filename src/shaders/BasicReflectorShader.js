// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Reflector.js by Slayvin

export const vertexShader = /* glsl */ `
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform mat4 uMatrix;

out vec4 vUv;

void main() {
    vUv = uMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tReflect;

in vec4 vUv;

out vec4 FragColor;

void main() {
    FragColor = textureProj(tReflect, vUv);
}
`;
