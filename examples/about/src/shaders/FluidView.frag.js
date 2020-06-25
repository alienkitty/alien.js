// Based on https://www.shadertoy.com/view/XlsBDf by davidar

export default /* glsl */`
precision highp float;

#define TWO_PI 6.28

uniform sampler2D tMap;
uniform vec2 uResolution;

void main() {
    vec4 c = texture2D(tMap, gl_FragCoord.xy / uResolution.xy);

    // Velocity
    gl_FragColor.rgb = 0.6 + 0.6 * cos(6.3 * atan(c.y, c.x) / TWO_PI + vec3(0, 23, 21));

    // Ink
    gl_FragColor.rgb *= c.w / 5.0;

    // Local fluid density
    gl_FragColor.rgb += clamp(c.z - 1.0, 0.0, 1.0) / 10.0;
    gl_FragColor.a = 1.0;
}
`;
