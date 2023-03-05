// Based on https://github.com/pmndrs/postprocessing by vanruesc
// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/SMAAPass.js by mpk

export const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

uniform vec2 uTexelSize;

out vec2 vOffset0;
out vec2 vOffset1;

out vec2 vUv;

void main() {
    vUv = uv;

    vOffset0 = uv + uTexelSize * vec2(1.0, 0.0);
    vOffset1 = uv + uTexelSize * vec2(0.0, 1.0);

    gl_Position = vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tWeightMap;
uniform vec2 uTexelSize;

in vec2 vOffset0;
in vec2 vOffset1;

in vec2 vUv;

out vec4 FragColor;

void movec(bvec2 c, inout vec2 variable, vec2 value) {
    if (c.x) { variable.x = value.x; }
    if (c.y) { variable.y = value.y; }
}

void movec(bvec4 c, inout vec4 variable, vec4 value) {
    movec(c.xy, variable.xy, value.xy);
    movec(c.zw, variable.zw, value.zw);
}

void main() {
    // Fetch the blending weights for the current pixel
    vec4 a;
    a.x = texture(tWeightMap, vOffset0).a;
    a.y = texture(tWeightMap, vOffset1).g;
    a.wz = texture(tWeightMap, vUv).rb;

    vec4 color = texture(tMap, vUv);

    // Ignore tiny blending weights
    if (dot(a, vec4(1.0)) >= 1e-5) {
        // max(horizontal) > max(vertical)
        bool h = max(a.x, a.z) > max(a.y, a.w);

        // Calculate the blending offsets
        vec4 blendingOffset = vec4(0.0, a.y, 0.0, a.w);
        vec2 blendingWeight = a.yw;
        movec(bvec4(h), blendingOffset, vec4(a.x, 0.0, a.z, 0.0));
        movec(bvec2(h), blendingWeight, a.xz);
        blendingWeight /= dot(blendingWeight, vec2(1.0));

        // Calculate the texture coordinates
        vec4 blendingCoord = blendingOffset * vec4(uTexelSize, -uTexelSize) + vUv.xyxy;

        // Rely on bilinear filtering to mix the current pixel with the neighbor
        color = blendingWeight.x * texture(tMap, blendingCoord.xy);
        color += blendingWeight.y * texture(tMap, blendingCoord.zw);
    }

    FragColor = color;
}
`;
