// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/AfterimageShader.js by HypnosNova
// Based on https://ompuco.wordpress.com/2018/03/29/creating-your-own-datamosh-effect/
// Based on https://www.youtube.com/watch?v=Uapad3pVxBY by Jam2go

import random from './modules/random/random.glsl.js';

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

uniform sampler2D tOld;
uniform sampler2D tNew;
uniform sampler2D tVelocity;
uniform float uAmount;
uniform float uLossy;
uniform float uDamping;
uniform vec2 uResolution;
uniform float uTime;
uniform int uFrame;

in vec2 vUv;

out vec4 FragColor;

${random}

void main() {
    if (uFrame < 10) {
        FragColor = texture(tNew, vUv);
        return;
    }

    vec2 blockUv = round(vUv * 32.0) / 32.0;

    // Noise float per UV block, changes over time
    float rnd = random(vec2(uTime, blockUv.x + blockUv.y * uResolution.x));

    vec2 vel = texture(tVelocity, mix(vUv, blockUv, uLossy)).xy;

    // Randomize motion vector
    vel = mix(vel, max(abs(vel) - round(rnd / 1.4), 0.0) * sign(vel), uLossy);

    vec2 motionUv = vUv - vel;

    vec4 color = mix(
        texture(tNew, vUv),
        texture(tOld, motionUv),
        mix(round(1.0 - rnd / 1.4) * uLossy, 1.0, uDamping) * uAmount
    );

    FragColor = color;
}
`;
