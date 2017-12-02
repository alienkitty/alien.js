uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uBeam;
uniform float uBeamWidth;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
