export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;
in vec2 uv;

#ifdef USE_INSTANCING
    in mat4 instanceMatrix;
#endif

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform mat3 uMapTransform;

out vec2 vUv;
out vec3 vNormal;

void main() {
    vUv = (uMapTransform * vec3(uv, 1.0)).xy;
    vNormal = normalize(normalMatrix * normal);

    vec4 mvPosition = vec4(position, 1.0);

    #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform vec3 uLightPosition;
uniform float uAlpha;

in vec2 vUv;
in vec3 vNormal;

out vec4 FragColor;

void main() {
    vec3 normal = normalize(vNormal);

    vec3 light = normalize(uLightPosition);
    float shading = dot(normal, light) * 0.15;

    FragColor = texture(tMap, vUv);
    FragColor.rgb += shading;
    FragColor.a *= uAlpha;
}
`;
