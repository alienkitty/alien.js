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

in vec2 vUv;
in vec4 vCoord;

out vec4 FragColor;

${blendOverlay}
${dither}

void main() {
    vec4 base = texture(tMap, vUv);
    vec4 blend = textureProj(tReflect, vCoord);

    FragColor = base * blend;

    base = FragColor;
    blend = vec4(uColor, 1.0);

    FragColor = blendOverlay(base, blend, 1.0);

    #ifdef USE_FOG
        float fogDepth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(uFogNear, uFogFar, fogDepth);

        FragColor.rgb = mix(FragColor.rgb, uFogColor, fogFactor);
    #endif

    #ifdef DITHERING
        FragColor.rgb = dither(FragColor.rgb);
    #endif
}
`;
