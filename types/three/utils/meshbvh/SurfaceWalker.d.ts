import { Matrix4, Ray, Triangle, Vector3 } from 'three';

import type { BufferGeometry } from 'three';

import { HalfEdgeMap } from './HalfEdgeMap.js';

export class TriangleFrame extends Triangle {
    normal: Vector3;
    transform: Matrix4;
    invTransform: Matrix4;
    vertices: [Vector3, Vector3, Vector3];

    constructor();

    update(): void;

    projectPoint(target: Vector3): Vector3;

    projectDirection(target: Vector3): Vector3;

    intersectEdge(ray: Ray, target: Vector3): number;

    override copy(source: Triangle): this;
}

export class SurfacePoint extends Vector3 {
    index: number;

    constructor(...args: any[]);
}

/**
 * A class to walk along a mesh surface using a half-edge geometry structure.
 *
 * @see {@link https://github.com/gkjohnson/three-sketches/tree/main/surface-flow | gkjohnson - Surface Flow Experiments}
 * @see {@link https://github.com/gkjohnson/three-sketches/blob/main/surface-flow/src/SurfaceWalker.js | gkjohnson - SurfaceWalker Source}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/meshbvh/SurfaceWalker.js | Source}
 */
export class SurfaceWalker {
    halfEdgeMap: HalfEdgeMap;
    geometry: BufferGeometry;
    planarWalk: boolean;

    constructor(geometry: BufferGeometry);

    getFrame(index: number, target: Triangle): void;

    movePoint(
        p: Vector3,
        dir: Vector3,
        targetPoint: Vector3,
        targetDir: Vector3,
        targetNormal: Vector3,
        edgeHitCallback: (vector: Vector3) => void
    ): void;
}
