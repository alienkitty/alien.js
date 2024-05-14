export const vertexShader = /* glsl */ `
in vec3 position;

#ifdef USE_INSTANCING
    in mat4 instanceMatrix;
#endif

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
    vec4 mvPosition = vec4(position, 1.0);

    #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec3 uColor;
uniform float uAlpha;

out vec4 FragColor;

void main() {
    FragColor = vec4(uColor, uAlpha);
}
`;
