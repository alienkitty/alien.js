// Based on https://www.shadertoy.com/view/MlXfz8 by laserdog

const float amount = 0.035;

vec4 apply(sampler2D tex, vec2 uv, float progress) {
    vec2 uvred = uv;
    vec2 uvblue = uv;
    float s = progress * amount;
    uvred.x += s;
    uvblue.x -= s;

    vec4 rgba = texture2D(tex, uv);
    rgba.r = texture2D(tex, uvred).r;
    rgba.b = texture2D(tex, uvblue).b;

    return rgba;
}

#pragma glslify: export(apply)
