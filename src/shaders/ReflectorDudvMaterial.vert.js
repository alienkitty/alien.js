export default /* glsl */`
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform mat3 uMapTransform;
uniform mat4 uMatrix;

varying vec2 vUv;
varying vec4 vCoord;

void main() {
    vUv = (uMapTransform * vec3(uv, 1.0)).xy;
    vCoord = uMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
