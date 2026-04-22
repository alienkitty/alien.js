// Based on https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/ by jespervos
// Based on https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/

import scaleUV from './modules/transformUV/scaleUV.glsl.js';
import saturate from './modules/saturate/saturate.glsl.js';
import fresnel from './modules/fresnel/fresnel.glsl.js';

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
uniform float uBackfaceAmount;
uniform float uMagnify;
uniform float uIorR;
uniform float uIorG;
uniform float uIorB;
uniform float uSaturation;
uniform float uRefractPower;
uniform float uRefractIntensity;
uniform float uFresnelPower;
uniform vec3 uFresnelColor;
uniform float uAlpha;
uniform vec2 uResolution;

in vec3 worldNormal;
in vec3 eyeVector;

out vec4 FragColor;

${scaleUV}
${saturate}
${fresnel}

void main() {
    float iorRatioRed = 1.0 / uIorR;
    float iorRatioGreen = 1.0 / uIorG;
    float iorRatioBlue = 1.0 / uIorB;

    vec2 uv = gl_FragCoord.xy / uResolution;

    vec3 backfaceNormal = texture(tBackfaceMap, uv).rgb;
    vec3 normal = worldNormal * (1.0 - uBackfaceAmount) - backfaceNormal * uBackfaceAmount;

    uv = scaleUV(uv, uMagnify);

    vec3 color = vec3(0.0);

    for (int i = 0; i < NUM_SAMPLES; i++) {
        float slide = float(i) / float(NUM_SAMPLES) * 0.1;

        vec3 refractedR = refract(eyeVector, normal, iorRatioRed);
        vec3 refractedG = refract(eyeVector, normal, iorRatioGreen);
        vec3 refractedB = refract(eyeVector, normal, iorRatioBlue);

        color.r += texture(tMap, uv + refractedR.xy * (uRefractPower + slide * 1.0) * uRefractIntensity).r;
        color.g += texture(tMap, uv + refractedG.xy * (uRefractPower + slide * 2.0) * uRefractIntensity).g;
        color.b += texture(tMap, uv + refractedB.xy * (uRefractPower + slide * 3.0) * uRefractIntensity).b;

        color = saturate(color, uSaturation);
    }

    color /= float(NUM_SAMPLES);

    float fresnel = getFresnel(eyeVector, normal, uFresnelPower);
    color.rgb = mix(color.rgb, uFresnelColor, fresnel);

    FragColor = vec4(color.rgb, uAlpha);
}
`;
