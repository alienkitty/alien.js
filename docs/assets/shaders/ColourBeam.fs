// Based on https://www.shadertoy.com/view/XdlSDs by dynamite

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uBeam;
uniform float uBeamWidth;

void main() {
    vec2 p = (gl_FragCoord.xy - uMouse.xy * uResolution.xy) / uResolution.y;
    float a = atan(p.x, p.y);
    float r = length(p) - uRadius;
    vec2 uv = vec2(a, r);

    vec3 horColour = vec3(gl_FragCoord.xy / uResolution.xy, 0.5);
    vec3 horBeam = vec3(abs(uBeam / (uBeamWidth * uv.y)));
    gl_FragColor = vec4(horBeam * horColour, 1.0);
}
