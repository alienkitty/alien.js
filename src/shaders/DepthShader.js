export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform float uAperture;

out vec3 vColor;

void main() {
    float linearDepth = 1.0 / uAperture;
    float linearPos = length(cameraPosition - position) * linearDepth;

    vColor = vec3(1.0 - linearPos);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

in vec3 vColor;

out vec4 FragColor;

void main() {
    FragColor = vec4(vColor, 1.0);
}
`;
