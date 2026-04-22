// Based on https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/ by jespervos
// Based on https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/

export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

out vec3 worldNormal;
out vec3 eyeVector;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    worldNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;
    eyeVector = normalize(worldPos.xyz - cameraPosition);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tBackfaceMap;
uniform vec3 uFresnelColor;
uniform float uAlpha;
uniform vec2 uResolution;

in vec3 worldNormal;
in vec3 eyeVector;

out vec4 FragColor;

float getFresnel(vec3 viewDir, vec3 worldNormal, float power) {
    return pow(1.0 - abs(dot(viewDir, worldNormal)), power);
}

vec3 sat(vec3 rgb, float intensity) {
    vec3 L = vec3(0.2125, 0.7154, 0.0721);
    vec3 grayscale = vec3(dot(rgb, L));
    return mix(grayscale, rgb, intensity);
}

const int LOOP = 16;
// const float iorRatio = 1.0 / 1.31;
// const float iorRatio = 1.0 / 1.33; // water
// const float iorRatio = 1.0 / 1.5;  // glass
// const float iorRatio = 1.0 / 2.42; // diamond
const float iorRatioRed = 1.0 / 1.15;
const float iorRatioGreen = 1.0 / 1.15;
const float iorRatioBlue = 1.0 / 1.18;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    vec3 backfaceNormal = texture(tBackfaceMap, uv).rgb;
    float a = 0.33;
    vec3 normal = worldNormal * (1.0 - a) - backfaceNormal * a;

    uv /= 1.5; // magnify

    vec3 color = vec3(0.0);

    for (int i = 0; i < LOOP; i++) {
        float slide = float(i) / float(LOOP) * 0.1;

        vec3 refractedR = refract(eyeVector, normal, iorRatioRed);
        vec3 refractedG = refract(eyeVector, normal, iorRatioGreen);
        vec3 refractedB = refract(eyeVector, normal, iorRatioBlue);

        color.r += texture(tMap, uv + refractedR.xy * (0.2 + slide * 1.0) * 0.3).r;
        color.g += texture(tMap, uv + refractedG.xy * (0.2 + slide * 1.0) * 0.5).g;
        color.b += texture(tMap, uv + refractedB.xy * (0.2 + slide * 3.0) * 0.5).b;

        color = sat(color, 1.06);
    }

    color /= float(LOOP);

    float fresnel = getFresnel(eyeVector, normal, 3.0);
    color.rgb = mix(color.rgb, uFresnelColor, fresnel);

    FragColor = vec4(color.rgb, uAlpha);
}
`;
