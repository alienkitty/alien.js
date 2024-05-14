export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

in vec3 vNormal;

out vec4 FragColor;

void main() {
    FragColor.rgb = normalize(vNormal);
    FragColor.a = 1.0;
}
`;
