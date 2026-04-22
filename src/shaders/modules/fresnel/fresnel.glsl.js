// Based on https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/ by jespervos
// Based on https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/

export default /* glsl */ `
float getFresnel(vec3 eyeVector, vec3 worldNormal, float power) {
    return pow(1.0 - abs(dot(eyeVector, worldNormal)), power);
}
`;
