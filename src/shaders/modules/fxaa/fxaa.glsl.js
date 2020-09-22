// From https://oframe.github.io/ogl/examples/?src=post-fxaa.html by gordonnl

export default /* glsl */`
vec4 fxaa(sampler2D tex, vec2 uv, vec2 resolution) {
    vec2 pixel = vec2(1) / resolution;
    vec3 l = vec3(0.299, 0.587, 0.114);
    float lNW = dot(texture2D(tex, uv + vec2(-1, -1) * pixel).rgb, l);
    float lNE = dot(texture2D(tex, uv + vec2( 1, -1) * pixel).rgb, l);
    float lSW = dot(texture2D(tex, uv + vec2(-1,  1) * pixel).rgb, l);
    float lSE = dot(texture2D(tex, uv + vec2( 1,  1) * pixel).rgb, l);
    float lM  = dot(texture2D(tex, uv).rgb, l);
    float lMin = min(lM, min(min(lNW, lNE), min(lSW, lSE)));
    float lMax = max(lM, max(max(lNW, lNE), max(lSW, lSE)));

    vec2 dir = vec2(
        -((lNW + lNE) - (lSW + lSE)),
            ((lNW + lSW) - (lNE + lSE))
    );

    float dirReduce = max((lNW + lNE + lSW + lSE) * 0.03125, 0.0078125);
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(8, 8), max(vec2(-8, -8), dir * rcpDirMin)) * pixel;

    vec3 rgbA = 0.5 * (
        texture2D(tex, uv + dir * (1.0 / 3.0 - 0.5)).rgb +
        texture2D(tex, uv + dir * (2.0 / 3.0 - 0.5)).rgb);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture2D(tex, uv + dir * -0.5).rgb +
        texture2D(tex, uv + dir * 0.5).rgb);
    float lB = dot(rgbB, l);
    return mix(
        vec4(rgbB, 1),
        vec4(rgbA, 1),
        max(sign(lB - lMin), 0.0) * max(sign(lB - lMax), 0.0)
    );
}
`;
