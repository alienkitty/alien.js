// Based on https://www.shadertoy.com/view/XlsBDf by davidar

export default /* glsl */`
precision highp float;

#define TWO_PI 6.28

uniform sampler2D tMap;
uniform vec2 uResolution;

out vec4 FragColor;

void main() {
    vec4 c = texture(tMap, gl_FragCoord.xy / uResolution.xy);

    // Velocity
    FragColor.rgb = 0.6 + 0.6 * cos(6.3 * atan(c.y, c.x) / TWO_PI + vec3(0, 23, 21));

    // Ink
    FragColor.rgb *= c.w / 5.0;

    // Local fluid density
    FragColor.rgb += clamp(c.z - 1.0, 0.0, 1.0) / 10.0;
    FragColor.a = 1.0;
}
`;
