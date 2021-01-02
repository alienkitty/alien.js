// Based on https://www.shadertoy.com/view/XlG3WD by Good

export default /* glsl */`
vec2 transform(vec2 uv, mat3 m, vec2 origin) {
    uv -= origin;
    uv = (vec3(uv, 1) * m).xy;
    uv += origin;

    return uv;
}

vec2 transform(vec2 uv, mat3 m) {
    return transform(uv, m, vec2(0.5));
}
`;
