// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/GammaCorrectionShader.js by WestLangley

export default /* glsl */ `
vec4 linearToSRGB(vec4 value) {
    return vec4(mix(pow(value.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), value.rgb * 12.92, vec3(lessThanEqual(value.rgb, vec3(0.0031308)))), value.a);
}
`;
