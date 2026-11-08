import { InstancedBufferGeometry } from 'three';

/**
 * A series of vertex pairs, forming line segments for an instanced polyline.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineSegmentsGeometry.js | three.js - LineSegmentsGeometry Source}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/lines/PolylineGeometry.js | Source}
 */
export class PolylineGeometry extends InstancedBufferGeometry {
    constructor();

    setPositions(array: Float32Array | number[]): this;

    override computeBoundingBox(): void;

    override computeBoundingSphere(): void;
}
