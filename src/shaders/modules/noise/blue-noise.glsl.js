// Based on https://www.shadertoy.com/view/MdGfDz by demofox

export default /* glsl */`
float getBlueNoise(sampler2D tex, vec2 coord, vec2 size, vec2 offset) {
    return texture(tex, coord * size + offset).r;
}

float getBlueNoise(sampler2D tex, vec2 coord, vec2 size) {
    return getBlueNoise(tex, coord, size, vec2(0));
}
`;
