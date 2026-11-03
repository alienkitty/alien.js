// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/SMAAPass.js by mpk

export const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

uniform vec2 uTexelSize;

out vec2 vUv;
out vec4 vOffset[3];
out vec2 vPixCoord;

void SMAABlendingWeightCalculationVS(vec2 texcoord) {
    vPixCoord = texcoord / uTexelSize;

    // Offsets for the searches
    vOffset[0] = texcoord.xyxy + uTexelSize.xyxy * vec4(-0.25, 0.125, 1.25, 0.125);
    vOffset[1] = texcoord.xyxy + uTexelSize.xyxy * vec4(-0.125, 0.25, -0.125, -1.25);

    // This indicates the ends of the loops
    vOffset[2] = vec4(vOffset[0].xz, vOffset[1].yw) + vec4(-2.0, 2.0, -2.0, 2.0) * uTexelSize.xxyy * float(SMAA_MAX_SEARCH_STEPS);
}

void main() {
    vUv = uv;

    SMAABlendingWeightCalculationVS(vUv);

    gl_Position = vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

#define SMAASampleLevelZeroOffset(tex, coord, offset) texture(tex, coord + float(offset) * uTexelSize)

uniform sampler2D tMap;
uniform sampler2D tArea;
uniform sampler2D tSearch;
uniform vec2 uTexelSize;

in vec2 vUv;
in vec4 vOffset[3];
in vec2 vPixCoord;

out vec4 FragColor;

float SMAASearchLength(sampler2D searchTex, vec2 e, float bias, float scale) {
    e.r = bias + e.r * scale;
    return 255.0 * texture(searchTex, e).r;
}

float SMAASearchXLeft(sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end) {
    vec2 e = vec2(0.0, 1.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; i++) {
        e = texture(edgesTex, texcoord).rg;
        texcoord -= vec2(2.0, 0.0) * uTexelSize;
        if (!(texcoord.x > end && e.g > 0.8281 && e.r == 0.0)) break;
    }

    texcoord.x += 0.25 * uTexelSize.x;
    texcoord.x += uTexelSize.x;
    texcoord.x += 2.0 * uTexelSize.x;
    texcoord.x -= uTexelSize.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

    return texcoord.x;
}

float SMAASearchXRight(sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end) {
    vec2 e = vec2(0.0, 1.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; i++) {
        e = texture(edgesTex, texcoord).rg;
        texcoord += vec2(2.0, 0.0) * uTexelSize;
        if (!(texcoord.x < end && e.g > 0.8281 && e.r == 0.0)) break;
    }

    texcoord.x -= 0.25 * uTexelSize.x;
    texcoord.x -= uTexelSize.x;
    texcoord.x -= 2.0 * uTexelSize.x;
    texcoord.x += uTexelSize.x * SMAASearchLength(searchTex, e, 0.5, 0.5);

    return texcoord.x;
}

float SMAASearchYUp(sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end) {
    vec2 e = vec2(1.0, 0.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; i++) {
        e = texture(edgesTex, texcoord).rg;
        texcoord += vec2(0.0, 2.0) * uTexelSize;
        if (!(texcoord.y > end && e.r > 0.8281 && e.g == 0.0)) break;
    }

    texcoord.y -= 0.25 * uTexelSize.y;
    texcoord.y -= uTexelSize.y;
    texcoord.y -= 2.0 * uTexelSize.y;
    texcoord.y += uTexelSize.y * SMAASearchLength(searchTex, e.gr, 0.0, 0.5);

    return texcoord.y;
}

float SMAASearchYDown(sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end) {
    vec2 e = vec2(1.0, 0.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; i++) {
        e = texture(edgesTex, texcoord).rg;
        texcoord -= vec2(0.0, 2.0) * uTexelSize;
        if (!(texcoord.y < end && e.r > 0.8281 && e.g == 0.0)) break;
    }

    texcoord.y += 0.25 * uTexelSize.y;
    texcoord.y += uTexelSize.y;
    texcoord.y += 2.0 * uTexelSize.y;
    texcoord.y -= uTexelSize.y * SMAASearchLength(searchTex, e.gr, 0.5, 0.5);

    return texcoord.y;
}

vec2 SMAAArea(sampler2D areaTex, vec2 dist, float e1, float e2) {
    // Rounding prevents precision errors of bilinear filtering
    vec2 texcoord = vec2(SMAA_AREATEX_MAX_DISTANCE) * round(4.0 * vec2(e1, e2)) + dist;

    // Apply a scale and bias for mapping to texel space
    texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + (0.5 * SMAA_AREATEX_PIXEL_SIZE);

    return texture(areaTex, texcoord).rg;
}

vec4 SMAABlendingWeightCalculationPS(vec2 texcoord, vec2 pixcoord, vec4 offset[3], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex) {
    vec4 weights = vec4(0.0);
    vec2 e = texture(edgesTex, texcoord).rg;

    if (e.g > 0.0) { // Edge at north
        vec2 d;

        // Find the distance to the left
        vec2 coords;
        coords.x = SMAASearchXLeft(edgesTex, searchTex, offset[0].xy, offset[2].x);
        coords.y = offset[1].y;
        d.x = coords.x;

        // Fetch the left crossing edges, two at a time using bilinear
        // filtering. Sampling at -0.25 to discern what value each edge has.
        float e1 = texture(edgesTex, coords).r;

        // Find the distance to the right
        coords.x = SMAASearchXRight(edgesTex, searchTex, offset[0].zw, offset[2].y);
        d.y = coords.x;

        // Translate distances into pixel units
        d = d / uTexelSize.x - pixcoord.x;

        // The area texture is compressed quadratically
        vec2 sqrtD = sqrt(abs(d));

        // Fetch the right crossing edges
        coords.y -= 1.0 * uTexelSize.y;
        float e2 = SMAASampleLevelZeroOffset(edgesTex, coords, vec2(1, 0)).r;

        // Get the area for this direction
        weights.rg = SMAAArea(areaTex, sqrtD, e1, e2);
    }

    if (e.r > 0.0) { // Edge at west
        vec2 d;

        // Find the distance to the top
        vec2 coords;
        coords.y = SMAASearchYUp(edgesTex, searchTex, offset[1].xy, offset[2].z);
        coords.x = offset[0].x;
        d.x = coords.y;

        // Fetch the top crossing edges
        float e1 = texture(edgesTex, coords).g;

        // Find the distance to the bottom
        coords.y = SMAASearchYDown(edgesTex, searchTex, offset[1].zw, offset[2].w);
        d.y = coords.y;

        // Translate distances into pixel units
        d = d / uTexelSize.y - pixcoord.y;

        // The area texture is compressed quadratically
        vec2 sqrtD = sqrt(abs(d));

        // Fetch the bottom crossing edges
        coords.y -= 1.0 * uTexelSize.y;
        float e2 = SMAASampleLevelZeroOffset(edgesTex, coords, vec2(0, 1)).g;

        // Get the area for this direction
        weights.ba = SMAAArea(areaTex, sqrtD, e1, e2);
    }

    return weights;
}

void main() {
    FragColor = SMAABlendingWeightCalculationPS(vUv, vPixCoord, vOffset, tMap, tArea, tSearch);
}
`;
