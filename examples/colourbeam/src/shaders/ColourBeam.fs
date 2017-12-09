// Based on https://www.shadertoy.com/view/XdlSDs by dynamite

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iRadius;
uniform float iBeam;
uniform float iBeamWidth;

void main() {
    vec2 p = (gl_FragCoord.xy - iMouse.xy * iResolution.xy) / iResolution.y;
    float a = atan(p.x, p.y);
    float r = length(p) - iRadius;
    vec2 uv = vec2(a, r);

    vec3 horColour = vec3(gl_FragCoord.xy / iResolution.xy, 0.5);
    vec3 horBeam = vec3(abs(iBeam / (iBeamWidth * uv.y)));
    gl_FragColor = vec4(horBeam * horColour, 1.0);
}
