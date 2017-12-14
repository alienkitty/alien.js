// Based on https://www.shadertoy.com/view/XdlSDs by dynamite

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float radius;
uniform float beam;
uniform float beamWidth;

void main() {
    vec2 p = (gl_FragCoord.xy - mouse.xy * resolution.xy) / resolution.y;
    float a = atan(p.x, p.y);
    float r = length(p) - radius;
    vec2 uv = vec2(a, r);

    vec3 horColour = vec3(gl_FragCoord.xy / resolution.xy, 0.5);
    vec3 horBeam = vec3(abs(beam / (beamWidth * uv.y)));
    gl_FragColor = vec4(horBeam * horColour, 1.0);
}
