/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/three-sketches/blob/main/common/BlueNoiseMeshPointsGenerator.js
 */

import { BufferAttribute, BufferGeometry, Vector3 } from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { MeshBVH } from 'three-mesh-bvh';

/**
 * A short implementation of blue noise sampling for triangle meshes.
 * @see {@link https://github.com/marmakoide/mesh-blue-noise-sampling | Mesh Blue Noise Sampling}
 */
export class MeshPointsGenerator {
    constructor(mesh) {
        this.sampler = new MeshSurfaceSampler(mesh);
        this.sampleCount = 1000;
        this.optionsMultiplier = 4;
        this.surfaceArea = -1;
    }

    getTargetDistance() {
        return Math.sqrt(this.surfaceArea / ((2 * this.sampleCount) * Math.sqrt(3)));
    }

    build() {
        this.sampler.build();

        this.surfaceArea = this.sampler.distribution[this.sampler.distribution.length - 1];
    }

    generate(outputFaceIndices = []) {
        if (this.sampler.distribution === null) {
            this.build();
        }

        const sampleCount = this.sampleCount;
        const points = new Array(this.optionsMultiplier * sampleCount);
        const faceIndices = new Array(this.optionsMultiplier * sampleCount);

        for (let i = 0, l = points.length; i < l; i++) {
            const v = new Vector3();
            const faceIndex = this.sampler._sampleFaceIndex();
            this.sampler._sampleFace(faceIndex, v);
            points[i] = v;
            faceIndices[i] = faceIndex;
        }

        const alpha = 8;
        const rmax = this.getTargetDistance();

        // Compute a KD-tree of the input point list
        const kdTree = new PointsBVH(points);

        // Compute the weight for each sample
        const D = pdist(points).map(el => {
            el = Math.min(el, 2 * rmax);

            return (1 - (el / (2 * rmax))) ** alpha;
        });

        const W = new Array(points.length).fill(0);

        for (let i = 0, l = points.length; i < l; i++) {
            const neighbors = kdTree.queryBallPoint(points[i], 2 * rmax);

            for (let j = 0, jl = neighbors.length; j < jl; j++) {
                const neighbor = neighbors[j];

                if (neighbor === i) {
                    continue;
                }

                const index = getTableIndex(i, neighbor, points.length);
                W[i] += D[index];
            }
        }

        // Pick the samples we need
        const heapArray = W.map((v, i) => [v, i]);
        const heapSort = (a, b) => a[0] - b[0];
        const heap = Array.from(heapArray).sort(heapSort);

        const ids = new Set(new Array(points.length).fill().map((v, i) => i));

        while (ids.size > sampleCount) {
            // Pick the sample with the highest weight
            const [, i] = heap.pop();
            ids.delete(i);

            const neighbors = new Set(kdTree.queryBallPoint(points[i], 2 * rmax));
            neighbors.delete(i);

            neighbors.forEach(v => {
                const info = heapArray[v];
                const index = getTableIndex(i, v, points.length);
                info[0] -= D[index];
            });

            heap.sort(heapSort);
        }

        // Output face indices
        const idsArray = Array.from(ids);
        outputFaceIndices.length = idsArray.length;
        idsArray.forEach((id, i) => {
            outputFaceIndices[i] = faceIndices[id];
        });

        // Job done
        return idsArray.map(id => points[id]);
    }
}

function getTableIndex(i, j, dim) {
    const i2 = Math.min(i, j);
    const j2 = Math.max(i, j);

    return dim * i2 + j2 - Math.floor((i2 + 2) * (i2 + 1) / 2);
}

// SciPy implementations
function pdist(points) {
    const l = points.length;
    const array = new Float32Array(l * (l - 1) / 2);
    let index = 0;

    for (let i = 0; i < l; i++) {
        const v1 = points[i];

        for (let j = i + 1; j < l; j++) {
            const v2 = points[j];
            array[index] = v1.distanceTo(v2);
            index++;
        }
    }

    return array;
}

// Points BVH
function generatePointsProxyGeometry(points) {
    const geometry = new BufferGeometry();
    geometry.setFromPoints(points);

    const index = new Uint32Array(points.length * 3);

    for (let i = 0, l = points.length; i < l; i++) {
        index[3 * i + 0] = i;
        index[3 * i + 1] = i;
        index[3 * i + 2] = i;
    }

    geometry.setIndex(new BufferAttribute(index, 1));

    return geometry;
}

export class PointsBVH extends MeshBVH {
    constructor(points, options) {
        super(generatePointsProxyGeometry(points), options);

        this.v = new Vector3();
    }

    queryBallPoint(point, dist) {
        const results = [];
        const distSq = dist * dist;

        this.shapecast({
            intersectsBounds: box => {
                const closestPoint = this.v.copy(point).clamp(box.min, box.max);

                return point.distanceToSquared(closestPoint) < distSq;
            },
            intersectsTriangle: (tri, triIndex) => {
                if (tri.a.distanceToSquared(point) < distSq) {
                    results.push(this.geometry.index.getX(3 * triIndex));
                }

                return false;
            }
        });

        return results;
    }
}
