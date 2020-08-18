// Based on {@link module:three/examples/jsm/postprocessing/UnrealBloomPass.js} by spidersharma and bhouston

export default /* glsl */`
#define MAX_KERNEL_RADIUS 11

float gaussianPdf(float x, float sigma) {
    return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
}

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction, int kernelRadius, int sigma) {
    vec2 invSize = 1.0 / resolution;
    float fSigma = float(sigma);
    float weightSum = gaussianPdf(0.0, fSigma);
    vec3 diffuseSum = texture2D(image, uv).rgb * weightSum;

    for (int i = 1; i < MAX_KERNEL_RADIUS; i++) {
        if (i >= kernelRadius) break;
        float x = float(i);
        float w = gaussianPdf(x, fSigma);
        vec2 uvOffset = direction * invSize * x;
        vec3 sample1 = texture2D(image, uv + uvOffset).rgb;
        vec3 sample2 = texture2D(image, uv - uvOffset).rgb;
        diffuseSum += (sample1 + sample2) * w;
        weightSum += 2.0 * w;
    }

    return vec4(diffuseSum / weightSum, 1.0);
}

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction, int kernelRadius) {
    return blur(image, uv, resolution, direction, kernelRadius, kernelRadius);
}
`;
