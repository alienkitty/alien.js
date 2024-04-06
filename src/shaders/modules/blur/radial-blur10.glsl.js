// Based on https://github.com/OGRECave/ogre/blob/master/Samples/Media/materials/programs/GLSL/Radial_Blur_FP.glsl
// Based on https://stackoverflow.com/questions/4579020/how-do-i-use-a-glsl-shader-to-apply-a-radial-blur-to-an-entire-scene

export default /* glsl */ `
vec4 radialBlur(sampler2D image, vec2 uv, float sampleDist, float sampleStrength) {
    float samples[10];
    samples[0] = -0.08;
    samples[1] = -0.05;
    samples[2] = -0.03;
    samples[3] = -0.02;
    samples[4] = -0.01;
    samples[5] =  0.01;
    samples[6] =  0.02;
    samples[7] =  0.03;
    samples[8] =  0.05;
    samples[9] =  0.08;

    vec2 dir = 0.5 - uv;
    float dist = sqrt(dir.x * dir.x + dir.y * dir.y);
    dir = dir / dist;

    vec4 color = texture(image, uv);
    vec4 sum = color;

    for (int i = 0; i < 10; i++) {
        sum += texture(image, uv + dir * samples[i] * sampleDist);
    }

    sum /= 10.0;
    float t = clamp(dist * sampleStrength, 0.0, 1.0);

    return mix(color, sum, t);
}
`;
