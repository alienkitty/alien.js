// Based on {@link module:three/examples/jsm/shaders/RGBShiftShader.js} by felixturner

export default /* glsl */`
vec4 getRGB(sampler2D image, vec2 uv, float angle, float amount) {
    vec2 offset = vec2(cos(angle), sin(angle)) * amount;
    vec4 r = texture2D(image, uv + offset);
    vec4 g = texture2D(image, uv);
    vec4 b = texture2D(image, uv - offset);
    return vec4(r.r, g.g, b.b, g.a);
}
`;
