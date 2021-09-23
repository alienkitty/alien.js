// Based on https://www.shadertoy.com/view/XtK3W3 by dyvoid

import simplex2d from './modules/noise/simplex2d.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uTime;

in vec2 vUv;

out vec4 FragColor;

${simplex2d}

void main() {
    vec2 uv = vUv;

    // Create large, incidental noise waves
    float noise = max(0.0, snoise(vec2(uTime, uv.y * 0.3)) - 0.3) * 0.25;

    // Offset by smaller, constant noise waves
    noise += (snoise(vec2(uTime * 20.0, uv.y * 2.4)) - 0.5) * 0.0375;

    // Apply the noise as X displacement for every line
    float xpos = uv.x - noise * noise * 0.25;
    FragColor = texture(tMap, vec2(xpos, uv.y));

    // Mix in some random interference for lines
    FragColor.rgb = mix(FragColor.rgb, vec3(0.0), noise * 0.3).rgb;

    // Apply a line pattern every 4 pixels
    if (floor(mod(gl_FragCoord.y * 0.25, 2.0)) == 0.0) {
        FragColor.rgb *= 1.0 - (0.15 * noise);
    }
}
`;
