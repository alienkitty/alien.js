import blendScreen from './modules/blending/screen.glsl.js';
import fresnel from './modules/fresnel/fresnel.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tFront;
uniform sampler2D tBack;
uniform vec3 uFresnelColor;
uniform float uFresnelPower;
uniform vec2 uResolution;

varying vec3 vWorldNormal;
varying vec3 vViewDirection;

${blendScreen}
${fresnel}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    vec4 base = texture2D(tFront, uv);
    vec4 blend = texture2D(tBack, uv);

    gl_FragColor = blendScreen(base, blend, 1.0);

    float fresnel = getFresnel(vViewDirection, vWorldNormal, uFresnelPower);
    gl_FragColor.rgb += (fresnel * uFresnelColor) * 0.2;
}
`;
