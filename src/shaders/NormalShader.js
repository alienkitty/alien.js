export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

#ifdef USE_INSTANCING
    in mat4 instanceMatrix;
#endif

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;

void main() {
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

in vec3 vNormal;

out vec4 FragColor;

void main() {
    FragColor.rgb = normalize(vNormal);
    FragColor.a = 1.0;
}
`;
