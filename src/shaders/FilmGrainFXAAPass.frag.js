// Based on {@link module:three/examples/jsm/shaders/FilmShader.js} by alteredq

import fxaa from './modules/fxaa/fxaa.glsl.js';
import random from './modules/random/random.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uIntensity;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vUv;

${fxaa}
${random}

void main(){
    // Sample the source
    vec4 color = fxaa(tMap, vUv * uResolution, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

    // Make some noise
    float dx = random(vUv + uTime);

    // Add noise
    vec3 cResult = color.rgb + color.rgb * clamp(0.1 + dx, 0.0, 1.0);

    // Interpolate between source and result by intensity
    cResult = color.rgb + clamp(uIntensity, 0.0, 1.0) * (cResult - color.rgb);

    gl_FragColor =  vec4(cResult, color.a);
}
`;
