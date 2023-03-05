// Based on https://github.com/pmndrs/postprocessing by vanruesc
// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/SMAAPass.js by mpk

export const vertexShader = /* glsl */ `
in vec3 position;

uniform vec2 uTexelSize;

out vec2 vUv;
out vec2 vUv0;
out vec2 vUv1;
out vec2 vUv2;
out vec2 vUv3;
out vec2 vUv4;
out vec2 vUv5;

void main() {
    vUv = position.xy * 0.5 + 0.5;

    // Left and top texel coordinates
    vUv0 = vUv + uTexelSize * vec2(-1.0, 0.0);
    vUv1 = vUv + uTexelSize * vec2(0.0, -1.0);

    // Right and bottom texel coordinates
    vUv2 = vUv + uTexelSize * vec2(1.0, 0.0);
    vUv3 = vUv + uTexelSize * vec2(0.0, 1.0);

    // Left-left and top-top texel coordinates
    vUv4 = vUv + uTexelSize * vec2(-2.0, 0.0);
    vUv5 = vUv + uTexelSize * vec2(0.0, -2.0);

    gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tMap;

in vec2 vUv;
in vec2 vUv0;
in vec2 vUv1;
in vec2 vUv2;
in vec2 vUv3;
in vec2 vUv4;
in vec2 vUv5;

out vec4 FragColor;

void main() {
    vec2 threshold = vec2(SMAA_THRESHOLD);

    // Color-based edge detection
    vec4 delta;
    vec3 c = texture(tMap, vUv).rgb;

    vec3 cLeft = texture(tMap, vUv0).rgb;
    vec3 t = abs(c - cLeft);
    delta.x = max(max(t.r, t.g), t.b);

    vec3 cTop = texture(tMap, vUv1).rgb;
    t = abs(c - cTop);
    delta.y = max(max(t.r, t.g), t.b);

    vec2 edges = step(threshold, delta.xy);

    if (dot(edges, vec2(1.0)) == 0.0) {
        discard;
    }

    // Calculate right and bottom deltas
    vec3 cRight = texture(tMap, vUv2).rgb;
    t = abs(c - cRight);
    delta.z = max(max(t.r, t.g), t.b);

    vec3 cBottom = texture(tMap, vUv3).rgb;
    t = abs(c - cBottom);
    delta.w = max(max(t.r, t.g), t.b);

    // Calculate the maximum delta in the direct neighborhood
    vec2 maxDelta = max(delta.xy, delta.zw);

    // Calculate left-left and top-top deltas
    vec3 cLeftLeft = texture(tMap, vUv4).rgb;
    t = abs(c - cLeftLeft);
    delta.z = max(max(t.r, t.g), t.b);

    vec3 cTopTop = texture(tMap, vUv5).rgb;
    t = abs(c - cTopTop);
    delta.w = max(max(t.r, t.g), t.b);

    // Calculate the final maximum delta
    maxDelta = max(maxDelta.xy, delta.zw);
    float finalDelta = max(maxDelta.x, maxDelta.y);

    // Local contrast adaptation
    edges *= step(0.5 * finalDelta, delta.xy);

    FragColor = vec4(edges, 0.0, 1.0);
}
`;
