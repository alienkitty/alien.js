/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/three-sketches/blob/main/surface-flow/src/HalfEdgeMap.js
 */

import { Vector3 } from 'three';

const HASH_MULTIPLIER = (1 + 1e-7) * 1e6;

const vertices = [new Vector3(), new Vector3(), new Vector3()];

function hashNumber(v) {
    return ~~(v * HASH_MULTIPLIER);
}

function hashVertex(v) {
    return `${hashNumber(v.x)},${hashNumber(v.y)},${hashNumber(v.z)}`;
}

/**
 * A class for a half-edge geometry structure.
 */
export class HalfEdgeMap {
    constructor(geometry) {
        this.data = null;
        this.unmatchedEdges = null;
        this.matchedEdges = null;
        this.useDrawRange = true;

        if (geometry) {
            this.updateFrom(geometry);
        }
    }

    getSiblingTriangleIndex(triIndex, edgeIndex) {
        const otherIndex = this.data[triIndex * 3 + edgeIndex];

        return otherIndex === -1 ? -1 : ~~(otherIndex / 3);
    }

    getSiblingEdgeIndex(triIndex, edgeIndex) {
        const otherIndex = this.data[triIndex * 3 + edgeIndex];

        return otherIndex === -1 ? -1 : (otherIndex % 3);
    }

    updateFrom(geometry) {
        // Runs on the assumption that there is a 1:1 match of edges
        const map = new Map();

        // Attributes
        const attributes = geometry.attributes;
        const indexAttr = geometry.index;
        const posAttr = attributes.position;

        // Get the potential number of triangles
        let triCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
        const maxTriCount = triCount;

        // Get the real number of triangles from the draw range
        let offset = 0;

        if (this.useDrawRange) {
            offset = geometry.drawRange.start;

            if (geometry.drawRange.count !== Infinity) {
                triCount = ~~(geometry.drawRange.count / 3);
            }
        }

        // Initialize the connectivity buffer, -1 means no connectivity
        let data = this.data;

        if (!data || data.length < 3 * maxTriCount) {
            data = new Int32Array(3 * maxTriCount);
        }

        data.fill(-1);

        // Iterate over all triangles
        let unmatchedEdges = 0;
        let matchedEdges = 0;

        for (let i = 0; i < triCount; i++) {
            const i3 = 3 * i + offset;

            for (let e = 0; e < 3; e++) {
                let i0 = i3 + e;

                if (indexAttr) {
                    i0 = indexAttr.getX(i0);
                }

                vertices[e].fromBufferAttribute(posAttr, i0);
            }

            for (let e = 0; e < 3; e++) {
                const nextE = (e + 1) % 3;
                const vec0 = vertices[e];
                const vec1 = vertices[nextE];

                const vh0 = hashVertex(vec0);
                const vh1 = hashVertex(vec1);

                const reverseHash = `${vh1}_${vh0}`;

                if (map.has(reverseHash)) {
                    // Create a reference between the two triangles and clear the hash
                    const otherIndex = map.get(reverseHash);
                    data[i3 + e] = otherIndex;
                    data[otherIndex] = i3 + e;
                    map.delete(reverseHash);
                    unmatchedEdges--;
                    matchedEdges++;
                } else {
                    // Save the triangle and triangle edge index captured in one value
                    const hash = `${vh0}_${vh1}`;
                    map.set(hash, i3 + e);
                    unmatchedEdges++;
                }
            }
        }

        this.matchedEdges = matchedEdges;
        this.unmatchedEdges = unmatchedEdges;
        this.data = data;
    }
}
