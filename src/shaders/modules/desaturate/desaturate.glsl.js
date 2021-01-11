// From https://gamedev.net/forums/topic/645131-color-saturation-in-glsl/5075530/

export default /* glsl */`
vec3 desaturate(vec3 color, float amount) {
    vec3 gray = vec3(dot(vec3(0.2126, 0.7152, 0.0722), color));
    return vec3(mix(color, gray, amount));
}
`;
