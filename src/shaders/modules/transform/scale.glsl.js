// Based on https://www.shadertoy.com/view/XlG3WD by Good

export default /* glsl */`
vec2 scale(vec2 uv, vec2 s, vec2 origin) {
    uv -= origin;
    uv *= mat2(1.0 / s.x, 0, 0, 1.0 / s.y);
    uv += origin;

    return uv;
}

vec2 scale(vec2 uv, vec2 s) {
    return scale(uv, s, vec2(0.5));
}

mat3 scale(vec2 s) {
    return mat3(
        1.0 / s.x, 0, 0,
        0, 1.0 / s.y, 0,
        0, 0, 1);
}
`;
