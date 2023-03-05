// Based on https://github.com/pmndrs/postprocessing by vanruesc
// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/SMAAPass.js by mpk

export const vertexShader = /* glsl */ `
in vec3 position;

uniform vec2 uResolution;
uniform vec2 uTexelSize;

out vec2 vUv;
out vec4 vOffset[3];
out vec2 vPixCoord;

void main() {
    vUv = position.xy * 0.5 + 0.5;
    vPixCoord = vUv * uResolution;

    // Offsets for the searches
    vOffset[0] = vUv.xyxy + uTexelSize.xyxy * vec4(-0.25, -0.125, 1.25, -0.125);
    vOffset[1] = vUv.xyxy + uTexelSize.xyxy * vec4(-0.125, -0.25, -0.125, 1.25);

    // This indicates the ends of the loops
    vOffset[2] = vec4(vOffset[0].xz, vOffset[1].yw) +
        vec4(-2.0, 2.0, -2.0, 2.0) * uTexelSize.xxyy * float(SMAA_MAX_SEARCH_STEPS);

    gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

#define sampleLevelZeroOffset(t, coord, offset) texture(t, coord + offset * uTexelSize)

uniform sampler2D tMap;
uniform sampler2D tArea;
uniform sampler2D tSearch;
uniform vec2 uResolution;
uniform vec2 uTexelSize;

in vec2 vUv;
in vec4 vOffset[3];
in vec2 vPixCoord;

out vec4 FragColor;

float searchLength(vec2 e, float offset) {
    // The texture is flipped vertically, with left and right cases taking half
    // of the space horizontally.
    vec2 scale = SMAA_SEARCHTEX_SIZE * vec2(0.5, -1.0);
    vec2 bias = SMAA_SEARCHTEX_SIZE * vec2(offset, 1.0);

    // Scale and bias to access texel centers
    scale += vec2(-1.0, 1.0);
    bias += vec2(0.5, -0.5);

    // Convert from pixel coordinates to texcoords
    scale *= 1.0 / SMAA_SEARCHTEX_PACKED_SIZE;
    bias *= 1.0 / SMAA_SEARCHTEX_PACKED_SIZE;

    return texture(tSearch, scale * e + bias).r;
}

float searchXLeft(in vec2 texCoord, float end) {
    vec2 e = vec2(0.0, 1.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; ++i) {
        if (!(texCoord.x > end && e.g > 0.8281 && e.r == 0.0)) {
            break;
        }

        e = texture(tMap, texCoord).rg;
        texCoord = vec2(-2.0, 0.0) * uTexelSize + texCoord;
    }

    float offset = -(255.0 / 127.0) * searchLength(e, 0.0) + 3.25;

    return uTexelSize.x * offset + texCoord.x;
}

float searchXRight(vec2 texCoord, float end) {
    vec2 e = vec2(0.0, 1.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; ++i) {
        if (!(texCoord.x < end && e.g > 0.8281 && e.r == 0.0)) {
            break;
        }

        e = texture(tMap, texCoord).rg;
        texCoord = vec2(2.0, 0.0) * uTexelSize.xy + texCoord;
    }

    float offset = -(255.0 / 127.0) * searchLength(e, 0.5) + 3.25;

    return -uTexelSize.x * offset + texCoord.x;
}

float searchYUp(vec2 texCoord, float end) {
    vec2 e = vec2(1.0, 0.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; ++i) {
        if (!(texCoord.y > end && e.r > 0.8281 && e.g == 0.0)) {
            break;
        }

        e = texture(tMap, texCoord).rg;
        texCoord = -vec2(0.0, 2.0) * uTexelSize.xy + texCoord;
    }

    float offset = -(255.0 / 127.0) * searchLength(e.gr, 0.0) + 3.25;

    return uTexelSize.y * offset + texCoord.y;
}

float searchYDown(vec2 texCoord, float end) {
    vec2 e = vec2(1.0, 0.0);

    for (int i = 0; i < SMAA_MAX_SEARCH_STEPS; i++) {
        if (!(texCoord.y < end && e.r > 0.8281 && e.g == 0.0)) {
            break;
        }

        e = texture(tMap, texCoord).rg;
        texCoord = vec2(0.0, 2.0) * uTexelSize.xy + texCoord;
    }

    float offset = -(255.0 / 127.0) * searchLength(e.gr, 0.5) + 3.25;

    return -uTexelSize.y * offset + texCoord.y;
}

vec2 area(vec2 dist, float e1, float e2, float offset) {
    // Rounding prevents precision errors of bilinear filtering
    vec2 texCoord = vec2(SMAA_AREATEX_MAX_DISTANCE) * round(4.0 * vec2(e1, e2)) + dist;

    // Apply a scale and bias for mapping to texel space
    texCoord = SMAA_AREATEX_PIXEL_SIZE * texCoord + 0.5 * SMAA_AREATEX_PIXEL_SIZE;

    // Move to the proper place, according to the subpixel offset
    texCoord.y = SMAA_AREATEX_SUBTEX_SIZE * offset + texCoord.y;

    return texture(tArea, texCoord).rg;
}

void main() {
    vec4 weights = vec4(0.0);
    vec4 subsampleIndices = vec4(0.0);
    vec2 e = texture(tMap, vUv).rg;

    if (e.g > 0.0) {
        // Edge at north
        vec2 d;

        // Find the distance to the left
        vec3 coords;
        coords.x = searchXLeft(vOffset[0].xy, vOffset[2].x);
        coords.y = vOffset[1].y;
        d.x = coords.x;

        // Now fetch the left crossing edges, two at a time using bilinear
        // filtering. Sampling at -0.25 to discern what value each edge has.
        float e1 = texture(tMap, coords.xy).r;

        // Find the distance to the right
        coords.z = searchXRight(vOffset[0].zw, vOffset[2].y);
        d.y = coords.z;

        // Translate distances to pixel units for better interleave arithmetic and
        // memory accesses.
        d = round(uResolution.xx * d + -vPixCoord.xx);

        // The area texture is compressed quadratically
        vec2 sqrtD = sqrt(abs(d));

        // Fetch the right crossing edges
        float e2 = sampleLevelZeroOffset(tMap, coords.zy, vec2(1, 0)).r;

        // Pattern recognized, now get the actual area
        weights.rg = area(sqrtD, e1, e2, subsampleIndices.y);
    }

    if (e.r > 0.0) {
        // Edge at west
        vec2 d;

        // Find the distance to the top
        vec3 coords;
        coords.y = searchYUp(vOffset[1].xy, vOffset[2].z);
        coords.x = vOffset[0].x;
        d.x = coords.y;

        // Fetch the top crossing edges
        float e1 = texture(tMap, coords.xy).g;

        // Find the distance to the bottom
        coords.z = searchYDown(vOffset[1].zw, vOffset[2].w);
        d.y = coords.z;

        // Translate distances into pixel units
        d = round(uResolution.yy * d - vPixCoord.yy);

        // The area texture is compressed quadratically
        vec2 sqrtD = sqrt(abs(d));

        // Fetch the bottom crossing edges
        float e2 = sampleLevelZeroOffset(tMap, coords.xz, vec2(0, 1)).g;

        // Get the area for this direction
        weights.ba = area(sqrtD, e1, e2, subsampleIndices.x);
    }

    FragColor = weights;
}
`;
