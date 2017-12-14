// Based on https://gl-transitions.com/editor/GlitchDisplace by mattdesl

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float opacity;
uniform float progress;

varying vec2 vUv;

highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

float voronoi(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    float res = 8.0;
    for (float j = -1.0; j <= 1.0; j++)
        for (float i = -1.0; i <= 1.0; i++) {
            vec2 b = vec2(i, j);
            vec2 r = b - f + random(p + b);
            float d = dot(r, r);
            res = min(res, d);
        }
    return sqrt(res);
}

vec2 displace(vec4 tex, vec2 texCoord, float dotDepth, float textureDepth, float strength) {
    float b = voronoi(0.003 * texCoord + 2.0);
    float g = voronoi(0.2 * texCoord);
    float r = voronoi(texCoord - 1.0);
    vec4 dt = tex * 1.0;
    vec4 dis = dt * dotDepth + 1.0 - tex * textureDepth;

    dis.x = dis.x - 1.0 + textureDepth * dotDepth;
    dis.y = dis.y - 1.0 + textureDepth * dotDepth;
    dis.x *= strength;
    dis.y *= strength;
    vec2 res_uv = texCoord;
    res_uv.x = res_uv.x + dis.x;
    res_uv.y = res_uv.y + dis.y;
    return res_uv;
}

float ease1(float t) {
    return t == 0.0 || t == 1.0
        ? t
        : t < 0.5
            ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
            : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float ease2(float t) {
    return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

void main() {
    vec4 color1 = texture2D(texture1, vUv);
    vec4 color2 = texture2D(texture2, vUv);
    vec2 disp1 = displace(color1, vUv, 0.33, 0.7, 1.0 - ease1(progress));
    vec2 disp2 = displace(color2, vUv, 0.33, 0.5, ease2(progress));
    vec4 dColor1 = texture2D(texture2, disp1);
    vec4 dColor2 = texture2D(texture1, disp2);
    float val = ease1(progress);
    //vec3 gray = vec3(dot(min(dColor2, dColor1).rgb, vec3(0.299, 0.587, 0.114)));
    //dColor2 = vec4(gray, 1.0);
    //dColor2 *= 2.0;
    dColor2 *= -2.0; // darken
    color1 = mix(color1, dColor2, smoothstep(0.0, 0.5, progress));
    color2 = mix(color2, dColor1, smoothstep(1.0, 0.5, progress));
    gl_FragColor = mix(color1, color2, val);
}
