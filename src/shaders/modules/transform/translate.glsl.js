// Based on https://www.shadertoy.com/view/XlG3WD by Good

export default /* glsl */`
vec2 translate(vec2 uv, vec2 t) {
    return uv - t;
}

mat3 translate(vec2 t) {
    return mat3(
        1, 0, -t.x,
        0, 1, -t.y,
        0, 0, 1);
}
`;
