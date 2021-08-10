import dither from './modules/dither/dither.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tReflect;
uniform sampler2D tReflectBlur;

varying vec2 vUv;
varying vec4 vCoord;

${dither}

void main() {
    vec2 reflectionUv = vCoord.xy / vCoord.w;

    vec4 dudv = texture2D(tMap, vUv);
    vec4 color = texture2D(tReflect, reflectionUv);

    vec4 blur;

    blur = texture2D(tReflectBlur, reflectionUv + dudv.rg / 256.0);
    color = mix(color, blur, smoothstep(1.0, 0.1, dudv.g));

    blur = texture2D(tReflectBlur, reflectionUv);
    color = mix(color, blur, smoothstep(0.5, 1.0, dudv.r));

    gl_FragColor = color * mix(0.6, 0.75, dudv.g);

    gl_FragColor.rgb = dither(gl_FragColor.rgb);
}
`;
