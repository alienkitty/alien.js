// From https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLProgram.js

export default /* glsl */ `
float luminance(vec3 rgb) {
    const vec3 weights = vec3(0.2126, 0.7152, 0.0722);
    return dot(weights, rgb);
}
`;
