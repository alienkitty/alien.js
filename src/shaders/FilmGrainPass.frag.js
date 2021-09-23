// Based on {@link module:three/examples/jsm/shaders/FilmShader.js} by alteredq

import random from './modules/random/random.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uIntensity;
uniform float uTime;

in vec2 vUv;

out vec4 FragColor;

${random}

void main(){
    // Sample the source
    vec4 color = texture(tMap, vUv);

    // Make some noise
    float dx = random(vUv + uTime);

    // Add noise
    vec3 result = color.rgb + color.rgb * clamp(0.1 + dx, 0.0, 1.0);

    // Interpolate between source and result by intensity
    result = color.rgb + clamp(uIntensity, 0.0, 1.0) * (result - color.rgb);

    FragColor = vec4(result, color.a);
}
`;
