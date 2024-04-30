import rgbshift from '../rgbshift/rgbshift.glsl.js';

// Based on https://github.com/OGRECave/ogre/blob/master/Samples/Media/materials/programs/GLSL/Radial_Blur_FP.glsl
// Based on https://stackoverflow.com/questions/4579020/how-do-i-use-a-glsl-shader-to-apply-a-radial-blur-to-an-entire-scene

export default /* glsl */ `
${rgbshift}

vec4 radialBlurRGB(sampler2D image, vec2 uv, float sampleDist, float sampleStrength, float rgbAngle, float rgbStrength) {
    float samples[8];
    samples[0] = -0.05;
    samples[1] = -0.03;
    samples[2] = -0.02;
    samples[3] = -0.01;
    samples[4] =  0.01;
    samples[5] =  0.02;
    samples[6] =  0.03;
    samples[7] =  0.05;

    vec2 dir = 0.5 - uv;
    float dist = sqrt(dir.x * dir.x + dir.y * dir.y);
    dir = dir / dist;

    vec4 color = getRGB(image, uv, rgbAngle, rgbStrength);
    vec4 sum = color;

    for (int i = 0; i < 8; i++) {
        sum += getRGB(image, uv + dir * samples[i] * sampleDist, rgbAngle, rgbStrength);
    }

    sum /= 8.0;
    float t = clamp(dist * sampleStrength, 0.0, 1.0);

    return mix(color, sum, t);
}
`;
