import blendOverlay from './modules/blending/overlay.glsl.js';
import dither from './modules/dither/dither.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tReflect;
uniform vec3 uColor;

#ifdef USE_FOG
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
#endif

varying vec2 vUv;
varying vec4 vCoord;

${blendOverlay}
${dither}

void main() {
    vec2 reflectionUv = vCoord.xy / vCoord.w;

    vec4 dudv = texture2D(tMap, vUv);
    vec4 color = texture2D(tReflect, reflectionUv);
    vec4 distortion = texture2D(tReflect, reflectionUv + dudv.rg / 256.0);

    color = mix(color, distortion, dudv.g);
    color = mix(color, distortion, dudv.r);

    gl_FragColor = color * mix(0.6, 0.75, dudv.g);

    vec4 base = gl_FragColor;
    vec4 blend = vec4(uColor, 1.0);

    gl_FragColor = blendOverlay(base, blend, 1.0);

    #ifdef USE_FOG
        float fogDepth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(uFogNear, uFogFar, fogDepth);

        gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, fogFactor);
    #endif

    #ifdef DITHERING
        gl_FragColor.rgb = dither(gl_FragColor.rgb);
    #endif
}
`;
