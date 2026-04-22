// Based on https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/ by jespervos

export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec3 worldNormal;

void main() {
    worldNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

in vec3 worldNormal;

out vec4 FragColor;

void main() {
    FragColor = vec4(worldNormal, 1.0);
}
`;
