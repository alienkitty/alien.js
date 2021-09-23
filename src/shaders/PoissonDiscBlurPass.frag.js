import blur from './modules/blur/poisson-disc-blur12.glsl.js';
import blueNoise from './modules/noise/blue-noise.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tBlueNoise;
uniform vec2 uBlueNoiseTexelSize;
uniform float uRadius;
uniform vec2 uResolution;
uniform float uTime;

in vec2 vUv;

out vec4 FragColor;

vec2 rot2d(vec2 p, float a) {
    vec2 sc = vec2(sin(a), cos(a));
    return vec2(dot(p, vec2(sc.y, -sc.x)), dot(p, sc.xy));
}

${blur}
${blueNoise}

void main() {
    float rnd = getBlueNoise(tBlueNoise, gl_FragCoord.xy, uBlueNoiseTexelSize, vec2(fract(uTime)));
    vec4 basis = vec4(rot2d(vec2(1, 0), rnd), rot2d(vec2(0, 1), rnd));

    FragColor = poissonSample(tMap, vUv, uResolution, uRadius, basis);
}
`;
