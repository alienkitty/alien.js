// Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass
// Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement

export const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tVelocity;
uniform sampler2D tBlueNoise;
uniform vec2 uBlueNoiseResolution;

in vec2 vUv;

out vec4 FragColor;

void main() {
    vec2 vel = texture(tVelocity, vUv).xy;

    float jitterValue = texture(tBlueNoise, gl_FragCoord.xy / uBlueNoiseResolution).r;
    vec2 jitterOffset = vel * vec2(jitterValue) / float(SAMPLES);

    vec4 result;

    vec2 startUv = clamp(vUv - vel * 0.5 + jitterOffset, 0.0, 1.0);
    vec2 endUv = clamp(vUv + vel * 0.5 + jitterOffset, 0.0, 1.0);

    for (int i = 0; i < SAMPLES; i++) {
        vec2 sampleUv = mix(startUv, endUv, float(i) / float(SAMPLES));
        result += texture(tMap, sampleUv);
    }

    result /= float(SAMPLES);

    FragColor = result;
}
`;
