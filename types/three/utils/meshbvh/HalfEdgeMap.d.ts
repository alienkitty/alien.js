import type { BufferGeometry } from 'three';

/**
 * A class for a half-edge geometry structure.
 *
 * @see {@link https://github.com/gkjohnson/three-sketches/tree/main/surface-flow | gkjohnson - Surface Flow Experiments}
 * @see {@link https://github.com/gkjohnson/three-sketches/blob/main/surface-flow/src/HalfEdgeMap.js | gkjohnson - HalfEdgeMap Source}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/meshbvh/HalfEdgeMap.js | Source}
 */
export class HalfEdgeMap {
    data: Int32Array | null;
    unmatchedEdges: number | null;
    matchedEdges: number | null;
    useDrawRange: boolean;

    constructor(geometry: BufferGeometry);

    getSiblingTriangleIndex(triIndex: number, edgeIndex: number): number;

    getSiblingEdgeIndex(triIndex: number, edgeIndex: number): number;

    updateFrom(geometry: BufferGeometry): void;
}
