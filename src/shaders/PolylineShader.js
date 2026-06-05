// Based on https://github.com/mattdesl/webgl-lines
// Based on https://oframe.github.io/ogl/examples/?src=polylines.html by gordonnl
// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineMaterial.js by WestLangley

export const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uLineWidth;
uniform vec2 uResolution;
uniform float uDPR;

in vec3 instanceStart;
in vec3 instanceEnd;

out vec2 vUv;

float trimSegmentAlpha(vec4 start, vec4 end) {
    float a = projectionMatrix[2][2];
    float b = projectionMatrix[3][2];
    float nearEstimate = a > 0.0 ? -b / (a + 1.0) : -0.5 * b / a;
    return (nearEstimate - start.z) / (end.z - start.z);
}

void main() {
    vUv = uv;

    float aspect = uResolution.x / uResolution.y;

    // Camera space
    vec4 start = modelViewMatrix * vec4(instanceStart, 1.0);
    vec4 end = modelViewMatrix * vec4(instanceEnd, 1.0);

    // Trim segments that terminate either in, or behind, the camera plane
    bool perspective = projectionMatrix[2][3] == -1.0;

    if (perspective) {
        if (start.z < 0.0 && end.z >= 0.0) {
            float alpha = trimSegmentAlpha(start, end);
            end.xyz = mix(start.xyz, end.xyz, alpha);
        } else if (end.z < 0.0 && start.z >= 0.0) {
            float alpha = trimSegmentAlpha(end, start);
            start.xyz = mix(end.xyz, start.xyz, alpha);
        }
    }

    // Clip space
    vec4 clipStart = projectionMatrix * start;
    vec4 clipEnd = projectionMatrix * end;

    // NDC space
    vec3 ndcStart = clipStart.xyz / clipStart.w;
    vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

    // Direction
    vec2 dir = ndcEnd.xy - ndcStart.xy;

    // Account for clip-space aspect ratio
    dir.x *= aspect;
    dir = normalize(dir);

    vec2 offset = vec2(dir.y, -dir.x);
    // Undo aspect ratio adjustment
    dir.x /= aspect;
    offset.x /= aspect;

    // Sign flip
    if (position.x < 0.0) offset *= -1.0;

    // Endcaps
    if (position.y < 0.0) {
        offset += -dir;
    } else if (position.y > 1.0) {
        offset += dir;
    }

    // Adjust for linewidth
    offset *= uLineWidth;

    // Adjust for clip-space to screen-space conversion
    offset /= uResolution.y / uDPR;

    // Select end
    vec4 clip = position.y < 0.5 ? clipStart : clipEnd;

    // Back to clip space
    offset *= clip.w;

    clip.xy += offset;

    gl_Position = clip;
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
