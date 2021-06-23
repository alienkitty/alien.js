// 2D noise based on https://www.shadertoy.com/view/4dS3Wd by morgan3d

import random from '../random/random.glsl.js';

export default /* glsl */`
${random}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Cubic Hermite curve
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Mix four corners percentages
    return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
`;
