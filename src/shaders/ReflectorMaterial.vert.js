export default /* glsl */ `
in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;

uniform mat3 uMapTransform;
uniform mat4 uMatrix;

out vec2 vUv;
out vec4 vCoord;
out vec3 vNormal;
out vec3 vToEye;

void main() {
    vUv = (uMapTransform * vec3(uv, 1.0)).xy;
    vCoord = uMatrix * vec4(position, 1.0);
    vNormal = normalMatrix * normal;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vToEye = cameraPosition - worldPosition.xyz;

    vec4 mvPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;
}
`;
