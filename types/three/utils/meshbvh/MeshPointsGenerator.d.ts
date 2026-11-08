import { Vector3 } from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { MeshBVH } from 'three-mesh-bvh';

import type { Mesh } from 'three';
import type { BVHOptions } from 'three-mesh-bvh';

/**
 * A short implementation of blue noise sampling for triangle meshes.
 *
 * @see {@link https://github.com/gkjohnson/three-sketches/tree/main/blue-surface-sample | gkjohnson - Blue Noise Surface Sampling Experiments}
 * @see {@link https://github.com/gkjohnson/three-sketches/blob/main/common/BlueNoiseMeshPointsGenerator.js | gkjohnson - BlueNoiseMeshPointsGenerator Source}
 * @see {@link https://github.com/marmakoide/mesh-blue-noise-sampling | Mesh Blue Noise Sampling}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/meshbvh/MeshPointsGenerator.js | Source}
 */
export class MeshPointsGenerator {
    sampler: MeshSurfaceSampler;
    sampleCount: number;
    optionsMultiplier: number;
    surfaceArea: number;

    constructor(mesh: Mesh);

    getTargetDistance(): number;

    build(): void;

    generate(outputFaceIndices: number[]): number[];
}

export class PointsBVH extends MeshBVH {
    constructor(points: Vector3[], options?: BVHOptions);

    queryBallPoint(point: Vector3, dist: number): number[];
}
