/**
 * @author pschroen / https://ufo.ai/
 */

import { Mesh } from 'three';

import { PolylineGeometry } from './PolylineGeometry.js';
import { PolylineMaterial } from '../../materials/PolylineMaterial.js';

/**
 * An instanced polyline mesh.
 *
 * @see {@link https://threejs.org/examples/#webgl_lines_fat | three.js - Fat Lines Example}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineGeometry.js | three.js - LineGeometry Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineSegments2.js | three.js - LineSegments2 Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/Line2.js | three.js - Line2 Source}
 */
export class Polyline extends Mesh {
    constructor({
        geometry,
        material,
        positions,
        color,
        lineWidth
    } = {}) {
        if (!geometry) {
            geometry = new PolylineGeometry();
        }

        if (!material) {
            material = new PolylineMaterial({
                color,
                lineWidth
            });
        }

        super(geometry, material);

        if (positions) {
            this.setPositions(positions);
        }
    }

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

        this.geometry.setPositions(points);

        return this;
    }
}
