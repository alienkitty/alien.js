varying vec2 vUv;
varying vec3 vNorm;

void main() {
    vUv = uv;
    vNorm = position.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
