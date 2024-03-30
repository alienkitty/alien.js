// Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass

import { ShaderChunk } from 'three';

export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform mat4 prevProjectionMatrix;
uniform mat4 prevModelViewMatrix;
uniform float expandGeometry;
uniform float interpolateGeometry;

out vec4 prevPosition;
out vec4 newPosition;

void main() {
    // Outputs the position of the current and last frame positions
    vec3 transformed;

    // Get the normal
    ${ShaderChunk.beginnormal_vertex}
    ${ShaderChunk.defaultnormal_vertex}

    // Get the current vertex position
    transformed = vec3(position);
    newPosition = modelViewMatrix * vec4(transformed, 1.0);

    // Get the previous vertex position
    transformed = vec3(position);
    prevPosition = prevModelViewMatrix * vec4(transformed, 1.0);

    // The delta between frames
    vec3 delta = newPosition.xyz - prevPosition.xyz;
    vec3 direction = normalize(delta);

    // Stretch along the velocity axes
    float stretchDot = dot(direction, transformedNormal);
    vec4 expandDir = vec4(direction, 0.0) * stretchDot * expandGeometry * length(delta);
    vec4 newPosition2 = projectionMatrix * (newPosition + expandDir);
    vec4 prevPosition2 = prevProjectionMatrix * (prevPosition + expandDir);

    newPosition = projectionMatrix * newPosition;
    prevPosition = prevProjectionMatrix * prevPosition;

    gl_Position = mix(newPosition2, prevPosition2, interpolateGeometry * (1.0 - step(0.0, stretchDot)));
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform float smearIntensity;

in vec4 prevPosition;
in vec4 newPosition;

out vec4 FragColor;

void main() {
    // Compute velocities in screen UV space
    vec3 vel = (newPosition.xyz / newPosition.w) - (prevPosition.xyz / prevPosition.w);

    FragColor = vec4(vel * smearIntensity, 1.0);
}
`;
