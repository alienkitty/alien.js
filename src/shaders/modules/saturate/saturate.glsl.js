// Based on https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/

export default /* glsl */ `
vec3 saturate(vec3 rgb, float intensity) {
    vec3 L = vec3(0.2125, 0.7154, 0.0721);
    vec3 grayscale = vec3(dot(rgb, L));
    return mix(grayscale, rgb, intensity);
}
`;
