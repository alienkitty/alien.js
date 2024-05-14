export const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

#ifdef USE_INSTANCING
    in mat4 instanceMatrix;
#endif

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
    vUv = uv;

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
uniform float uAlpha;

in vec2 vUv;

out vec4 FragColor;

void main() {
    FragColor = texture(tMap, vUv);
    FragColor.a *= uAlpha;
}
`;
