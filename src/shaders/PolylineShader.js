// Based on https://oframe.github.io/ogl/examples/?src=polylines.html by gordonnl

export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 next;
in vec3 prev;
in float side;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uLineWidth;
uniform float uMiter;
uniform vec2 uResolution;
uniform float uDPR;

out vec2 vUv;

void main() {
    vUv = uv;

    mat4 mvp = projectionMatrix * modelViewMatrix;
    vec4 current = mvp * vec4(position, 1);
    vec4 nextPos = mvp * vec4(next, 1);
    vec4 prevPos = mvp * vec4(prev, 1);

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
    vec2 currentScreen = current.xy / current.w * aspect;
    vec2 nextScreen = nextPos.xy / nextPos.w * aspect;
    vec2 prevScreen = prevPos.xy / prevPos.w * aspect;

    vec2 dir1 = normalize(currentScreen - prevScreen);
    vec2 dir2 = normalize(nextScreen - currentScreen);
    vec2 dir = normalize(dir1 + dir2);

    vec2 normal = vec2(-dir.y, dir.x);
    normal /= mix(1.0, max(0.3, dot(normal, vec2(-dir1.y, dir1.x))), uMiter);
    normal /= aspect;

    float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
    float pixelWidth = current.w * pixelWidthRatio;
    normal *= pixelWidth * uLineWidth;
    current.xy -= normal * side;

    gl_Position = current;
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec3 uColor;
uniform float uAlpha;

in vec2 vUv;

out vec4 FragColor;

void main() {
    FragColor = vec4(uColor, uAlpha);
}
`;
