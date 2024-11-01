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

    vec2 uvr = round(vUv * 32.0) / 32.0;

    float n = random(vec2(uTime, uvr.x + uvr.y * uResolution.x));
    // Noise float per UV block, changes over time

    vec4 mot = texture(tVelocity, uvr);
    mot = max(abs(mot) - round(n / 1.4), 0.0) * sign(mot); // Random motion vector

    vec2 mvuv = vUv - mot.rg;
    // vec4 col = mix(texture(tNew, vUv), texture(tPR, mvuv), mix(round(1.0 - n / 1.4), 1.0, uButton));
    // Button@0=lossy w/ noise, Button@1=total loss
    vec4 col = mix(texture(tNew, vUv), texture(tOld, mvuv), mix(round(1.0 - n / 1.4), 1.0, uDamping));

    FragColor = col;
}
/* void main() {
    if (uFrame < 10) {
        // FragColor = vec4(0, 0, 1, 0);
        FragColor = texture(tNew, vUv);
        return;
    }

    vec2 uvr = round(vUv * (uResolution.xy / 32.0)) / (uResolution.xy / 32.0);
    // Take resolution into account so blocks aren't stretched
    vec4 mot = texture(tVelocity, uvr);
    // vec4 mot = texture(tVelocity, vUv);

    // vec2 mvuv = vec2(vUv.x - mot.r, vUv.y - mot.g);
    vec2 mvuv = vUv - mot.rg;

    // vec4 col = mix(texture(tNew, vUv), texture(tPR, mvuv), uButton);
    vec4 col = mix(texture(tNew, vUv), texture(tOld, mvuv), uDamping);

    FragColor = col;
} */
/* uniform sampler2D tNew;
uniform sampler2D tVelocity;

in vec2 vUv;

out vec4 FragColor;

void main() {
    vec4 mot = texture(tVelocity, vUv);

    // Add motion vectors directly to UV position for sampling color
    vec4 col = texture(tNew, vUv + mot.rg);

    FragColor = col;
} */
/* void main() {
    vec4 col = texture(tNew, vUv);
    vec4 mot = texture(tVelocity, vUv);

    col += mot; // Add motion vector values to the current colors

    FragColor = col;
} */
`;
