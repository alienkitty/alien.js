import { PolylineGeometry } from './PolylineGeometry.js';

/**
 * A chain of vertices, forming an instanced "fat" polyline.
 *
 * @see {@link https://threejs.org/examples/#webgl_lines_fat | three.js - Fat Lines Example}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineGeometry.js | three.js - LineGeometry Source}
 */
export class Polyline extends PolylineGeometry {
    setPositions(array) {
        // Convert to vertex pairs (start, end)
        const length = array.length - 3;
        const points = new Float32Array(2 * length);

        for (let i = 0; i < length; i += 3) {
            points[2 * i] = array[i];
            points[2 * i + 1] = array[i + 1];
            points[2 * i + 2] = array[i + 2];

            points[2 * i + 3] = array[i + 3];
            points[2 * i + 4] = array[i + 4];
            points[2 * i + 5] = array[i + 5];
        }

        super.setPositions(points);

        return this;
    }
}
