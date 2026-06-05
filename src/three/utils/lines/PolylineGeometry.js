import {
    Box3,
    Float32BufferAttribute,
    InstancedBufferGeometry,
    InstancedInterleavedBuffer,
    InterleavedBufferAttribute,
    Sphere,
    Vector3
} from 'three';

const box = new Box3();
const vector = new Vector3();

/**
 * A series of vertex pairs, forming line segments for an instanced "fat" polyline.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineSegmentsGeometry.js | three.js - LineSegmentsGeometry Source}
 */
export class PolylineGeometry extends InstancedBufferGeometry {
    constructor() {
        super();

        const positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0];
        const uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
        const indices = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];

        this.setAttribute('position', new Float32BufferAttribute(positions, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
        this.setIndex(indices);
    }

    setPositions(array) {
        let lineSegments;

        if (array instanceof Float32Array) {
            lineSegments = array;
        } else if (Array.isArray(array)) {
            lineSegments = new Float32Array(array);
        }

        const instanceBuffer = new InstancedInterleavedBuffer(lineSegments, 6, 1);

        this.setAttribute('instanceStart', new InterleavedBufferAttribute(instanceBuffer, 3, 0));
        this.setAttribute('instanceEnd', new InterleavedBufferAttribute(instanceBuffer, 3, 3));

        this.instanceCount = this.attributes.instanceStart.count;

        this.computeBoundingBox();
        this.computeBoundingSphere();

        return this;
    }

    computeBoundingBox() {
        if (!this.boundingBox) {
            this.boundingBox = new Box3();
        }

        const start = this.attributes.instanceStart;
        const end = this.attributes.instanceEnd;

        if (start !== undefined && end !== undefined) {
            this.boundingBox.setFromBufferAttribute(start);

            box.setFromBufferAttribute(end);

            this.boundingBox.union(box);
        }
    }

    computeBoundingSphere() {
        if (!this.boundingSphere) {
            this.boundingSphere = new Sphere();
        }

        if (!this.boundingBox) {
            this.computeBoundingBox();
        }

        const start = this.attributes.instanceStart;
        const end = this.attributes.instanceEnd;

        if (start !== undefined && end !== undefined) {
            const center = this.boundingSphere.center;

            this.boundingBox.getCenter(center);

            let maxRadiusSq = 0;

            for (let i = 0, l = start.count; i < l; i++) {
                vector.fromBufferAttribute(start, i);
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));

                vector.fromBufferAttribute(end, i);
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
            }

            this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
        }
    }
}
