// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineMaterial.js by WestLangley
// Based on https://github.com/mattdesl/webgl-lines
// Based on https://oframe.github.io/ogl/examples/?src=polylines.html by gordonnl
// Based on https://github.com/range-et/PGL

export const vertexShader = /* glsl */ `
in vec3 position;
in vec3 positionStart;
in vec3 positionEnd;
in float side;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uLineWidth;
uniform vec2 uResolution;
uniform float uDPR;

out vec2 vUv;

void main() {
    vUv = uv;

    vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec4 clipStart = projectionMatrix * modelViewMatrix * vec4(positionStart, 1.0);
    vec4 clipEnd = projectionMatrix * modelViewMatrix * vec4(positionEnd, 1.0);

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
    vec2 ndcStart = clipStart.xy / clipStart.w * aspect;
    vec2 ndcEnd = clipEnd.xy / clipEnd.w * aspect;

    vec2 dir = normalize(ndcEnd - ndcStart);
    vec2 offset = vec2(-dir.y, dir.x);
    offset /= aspect;

    float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
    float pixelWidth = clipPos.w * pixelWidthRatio;
    offset *= pixelWidth * uLineWidth;
    clipPos.xy -= offset * side;

    gl_Position = clipPos;
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
