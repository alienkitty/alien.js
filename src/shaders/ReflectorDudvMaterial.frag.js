import dither from './modules/dither/dither.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tReflect;
uniform sampler2D tReflectBlur;

in vec2 vUv;
in vec4 vCoord;

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

    FragColor.rgb = dither(FragColor.rgb);
}
`;
