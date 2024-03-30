// Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass
// Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement

export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform mat4 uPrevModelViewMatrix;
uniform mat4 uPrevProjectionMatrix;

out vec4 vPrevPosition;
out vec4 vNewPosition;

out vec3 vNormal;

void main() {
    // Outputs the position of the current and last frame positions
    vNewPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vPrevPosition = uPrevProjectionMatrix * uPrevModelViewMatrix * vec4(position, 1.0);

    vNormal = normalMatrix * normal;

    gl_Position = vPrevPosition;
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform float uIntensity;

in vec4 vPrevPosition;
in vec4 vNewPosition;

in vec3 vNormal;

out vec4 FragColor;

void main() {
    // Compute velocities in screen UV space
    vec3 pos0 = vPrevPosition.xyz / vPrevPosition.w;
    pos0 += 1.0;
    pos0 /= 2.0;

    vec3 pos1 = vNewPosition.xyz / vNewPosition.w;
    pos1 += 1.0;
    pos1 /= 2.0;

    vec3 vel = pos1 - pos0;
    FragColor = vec4(vel * uIntensity, 1.0);

    // FragColor = vec4(vNormal, 1.0);
}
`;
