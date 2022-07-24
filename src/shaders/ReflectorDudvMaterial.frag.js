import dither from './modules/dither/dither.glsl.js';

export default /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tReflect;
uniform sampler2D tReflectBlur;
uniform float uReflectivity;

in vec2 vUv;
in vec4 vCoord;
in vec3 vNormal;
in vec3 vToEye;

out vec4 FragColor;

${dither}

void main() {
    vec2 reflectionUv = vCoord.xy / vCoord.w;

    vec4 dudv = texture(tMap, vUv);
    vec4 color = texture(tReflect, reflectionUv);

    vec4 blur;

    blur = texture(tReflectBlur, reflectionUv + dudv.rg / 256.0);
    color = mix(color, blur, smoothstep(1.0, 0.1, dudv.g));

    blur = texture(tReflectBlur, reflectionUv);
    color = mix(color, blur, smoothstep(0.5, 1.0, dudv.r));

    FragColor = color * mix(0.6, 0.75, dudv.g);

    // Fresnel term
    vec3 toEye = normalize(vToEye);
    float theta = max(dot(toEye, vNormal), 0.0);
    float reflectance = uReflectivity + (1.0 - uReflectivity) * pow((1.0 - theta), 5.0);

    FragColor = mix(vec4(0), FragColor, reflectance);

    #ifdef DITHERING
        FragColor.rgb = dither(FragColor.rgb);
    #endif

    FragColor.a = 1.0;
}
`;
