// Based on https://github.com/CODAME/clonicoptics-video-capture

import simplex2d from '../noise/simplex2d.glsl.js';

export default /* glsl */`
const float speed = 0.5;

${simplex2d}

vec4 getBadTV(sampler2D tDiffuse, vec2 uv, float time, float distortion, float distortion2, float rollSpeed) {
    vec2 p = uv;
    float ty = time * speed;
    float yt = p.y - ty;

    // Smooth distortion
    float offset = snoise(vec2(yt * 3.0, 0.0)) * 0.2;

    // Boost distortion
    if (distortion > 0.0) offset = pow(offset * distortion, 3.0) / distortion;
    else offset = 0.0;

    // Add fine grain distortion
    offset += snoise(vec2(yt * 50.0, 0.0)) * distortion2 * 0.001;

    // Combine distortion on X with roll on Y
    return texture2D(tDiffuse, vec2(fract(p.x + offset), fract(p.y - time * rollSpeed)));
}
`;
