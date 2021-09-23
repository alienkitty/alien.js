import blendScreen from './modules/blending/screen.glsl.js';
import fresnel from './modules/fresnel/fresnel.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tFront;
uniform sampler2D tBack;
uniform vec3 uFresnelColor;
uniform float uFresnelPower;
uniform vec2 uResolution;

in vec3 vWorldNormal;
in vec3 vViewDirection;

out vec4 FragColor;

${blendScreen}
${fresnel}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    vec4 base = texture(tFront, uv);
    vec4 blend = texture(tBack, uv);

    FragColor = blendScreen(base, blend, 1.0);

    float fresnel = getFresnel(vViewDirection, vWorldNormal, uFresnelPower);
    FragColor.rgb += (fresnel * uFresnelColor) * 0.2;
}
`;
