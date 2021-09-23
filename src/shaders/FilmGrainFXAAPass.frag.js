// Based on {@link module:three/examples/jsm/shaders/FilmShader.js} by alteredq

import fxaa from './modules/fxaa/fxaa.glsl.js';
import random from './modules/random/random.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uIntensity;
uniform vec2 uResolution;
uniform float uTime;

in vec2 v_rgbNW;
in vec2 v_rgbNE;
in vec2 v_rgbSW;
in vec2 v_rgbSE;
in vec2 v_rgbM;

in vec2 vUv;

out vec4 FragColor;

${fxaa}
${random}

void main(){
    // Sample the source
    vec4 color = fxaa(tMap, vUv * uResolution, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

    // Make some noise
    float dx = random(vUv + uTime);

    // Add noise
    vec3 result = color.rgb + color.rgb * clamp(0.1 + dx, 0.0, 1.0);

    // Interpolate between source and result by intensity
    result = color.rgb + clamp(uIntensity, 0.0, 1.0) * (result - color.rgb);

    FragColor = vec4(result, color.a);
}
`;
