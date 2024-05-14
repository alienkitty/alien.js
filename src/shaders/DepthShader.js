import dither from './modules/dither/dither.glsl.js';

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

out vec4 FragColor;

${dither}

void main() {
    FragColor = vec4(vec3(gl_FragCoord.w), 1.0);

    FragColor.rgb = dither(FragColor.rgb);
    FragColor.a = 1.0;
}
`;
