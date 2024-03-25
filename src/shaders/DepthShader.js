import dither from './modules/dither/dither.glsl.js';

export const vertexShader = /* glsl */ `
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
