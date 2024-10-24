// Based on https://threejs.org/examples/#webgl_multiple_rendertargets by takahirox
// Based on https://oframe.github.io/ogl/examples/?src=mrt.html by gordonnl
// Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass
// Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement

export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

#ifdef USE_INSTANCING
    in mat4 instanceMatrix;
    in mat4 instancePrevMatrix;
#endif

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform mat4 uPrevModelViewMatrix;
uniform mat4 uPrevProjectionMatrix;
uniform float uInterpolateGeometry;

out vec3 vNormal;
out vec3 vWorldPosition;
out vec4 vPrevPosition;
out vec4 vNewPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    // Outputs the position of the current and last frame positions
    vNewPosition = vec4(position, 1.0);
    vPrevPosition = vec4(position, 1.0);

    #ifdef USE_INSTANCING
        vNewPosition = instanceMatrix * vNewPosition;
        vPrevPosition = instancePrevMatrix * vPrevPosition;
    #endif

    vNewPosition = projectionMatrix * modelViewMatrix * vNewPosition;
    vPrevPosition = uPrevProjectionMatrix * uPrevModelViewMatrix * vPrevPosition;

    // The delta between frames
    vec3 delta = vNewPosition.xyz - vPrevPosition.xyz;
    vec3 direction = normalize(delta);

    // Stretch along the velocity axes
    vec3 transformedNormal = normalMatrix * normal;
    float stretchDot = dot(direction, transformedNormal);

    gl_Position = mix(vNewPosition, vPrevPosition, uInterpolateGeometry * (1.0 - step(0.0, stretchDot)));
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform float uSmearIntensity;

in vec3 vNormal;
in vec3 vWorldPosition;
in vec4 vPrevPosition;
in vec4 vNewPosition;

layout(location = 0) out vec4 gNormal;
layout(location = 1) out vec4 gPosition;
layout(location = 2) out vec4 gVelocity;

void main() {
    // Write normals to G-Buffer
    gNormal = vec4(normalize(vNormal), 1.0);

    // Write world positions and depth to G-Buffer
    gPosition = vec4(vWorldPosition, gl_FragCoord.z);

    // Write velocities in screen UV space to G-Buffer
    vec3 pos0 = vPrevPosition.xyz / vPrevPosition.w;
    pos0 += 1.0;
    pos0 /= 2.0;

    vec3 pos1 = vNewPosition.xyz / vNewPosition.w;
    pos1 += 1.0;
    pos1 /= 2.0;

    vec3 vel = pos1 - pos0;
    gVelocity = vec4(vel * uSmearIntensity, 1.0);
}
`;
