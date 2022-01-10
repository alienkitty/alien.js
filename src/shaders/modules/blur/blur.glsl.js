// Based on {@link module:three/examples/jsm/shaders/HorizontalBlurShader.js} by zz85

export default /* glsl */`
vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 sum = vec4(0.0);

    vec2 pixel = 1.0 / resolution;

    sum += texture(image, uv - 4.0 * pixel * direction) * 0.051;
    sum += texture(image, uv - 3.0 * pixel * direction) * 0.0918;
    sum += texture(image, uv - 2.0 * pixel * direction) * 0.12245;
    sum += texture(image, uv - 1.0 * pixel * direction) * 0.1531;
    sum += texture(image, uv) * 0.1633;
    sum += texture(image, uv + 1.0 * pixel * direction) * 0.1531;
    sum += texture(image, uv + 2.0 * pixel * direction) * 0.12245;
    sum += texture(image, uv + 3.0 * pixel * direction) * 0.0918;
    sum += texture(image, uv + 4.0 * pixel * direction) * 0.051;

    return sum;
}
`;
