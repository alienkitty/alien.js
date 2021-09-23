// Based on {@link module:three/examples/jsm/shaders/HorizontalBlurShader.js} by zz85

export default /* glsl */`
vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec2 pixel = vec2(1) / resolution;

    vec4 color = vec4(0.0);
    color += texture(image, uv - 4.0 * pixel * direction) * 0.051;
    color += texture(image, uv - 3.0 * pixel * direction) * 0.0918;
    color += texture(image, uv - 2.0 * pixel * direction) * 0.12245;
    color += texture(image, uv - 1.0 * pixel * direction) * 0.1531;
    color += texture(image, uv) * 0.1633;
    color += texture(image, uv + 1.0 * pixel * direction) * 0.1531;
    color += texture(image, uv + 2.0 * pixel * direction) * 0.12245;
    color += texture(image, uv + 3.0 * pixel * direction) * 0.0918;
    color += texture(image, uv + 4.0 * pixel * direction) * 0.051;

    return color;
}
`;
