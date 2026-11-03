/**
 * @author pschroen / https://ufo.ai/
 */

import { Mesh, Vector3 } from 'three';

import { PolylineGeometry } from './PolylineGeometry.js';
import { PolylineMaterial } from '../../materials/PolylineMaterial.js';

/**
 * An instanced polyline wireframe mesh.
 *
 * @see {@link https://threejs.org/examples/#webgl_lines_fat_wireframe | three.js - Fat Lines Wireframe Example}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/geometries/WireframeGeometry.js | three.js - WireframeGeometry Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/WireframeGeometry2.js | three.js - WireframeGeometry2 Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/Wireframe.js | three.js - Wireframe Source}
 */
export class Wireframe extends Mesh {
    constructor({
        geometry,
        material,
        color,
        lineWidth
    } = {}) {
        if (geometry) {
            // Buffer
            const vertices = [];
            const edges = new Set();

            // Helper variables
            const start = new Vector3();
            const end = new Vector3();

            if (geometry.index) {
                const position = geometry.attributes.position;
                const indices = geometry.index;
                let groups = geometry.groups;

                if (!groups.length) {
                    groups = [{ start: 0, count: indices.count, materialIndex: 0 }];
                }

                // Create a data structure that contains all edges without duplicates
                for (let o = 0, ol = groups.length; o < ol; ++o) {
                    const group = groups[o];

                    const groupStart = group.start;
                    const groupCount = group.count;

                    for (let i = groupStart, l = groupStart + groupCount; i < l; i += 3) {
                        for (let j = 0; j < 3; j++) {
                            const index1 = indices.getX(i + j);
                            const index2 = indices.getX(i + (j + 1) % 3);

                            start.fromBufferAttribute(position, index1);
                            end.fromBufferAttribute(position, index2);

                            if (isUniqueEdge(start, end, edges)) {
                                vertices.push(start.x, start.y, start.z);
                                vertices.push(end.x, end.y, end.z);
                            }
                        }
                    }
                }
            } else {
                const position = geometry.attributes.position;

                for (let i = 0, l = position.count / 3; i < l; i++) {
                    for (let j = 0; j < 3; j++) {
                        const index1 = 3 * i + j;
                        const index2 = 3 * i + ((j + 1) % 3);

                        start.fromBufferAttribute(position, index1);
                        end.fromBufferAttribute(position, index2);

                        if (isUniqueEdge(start, end, edges)) {
                            vertices.push(start.x, start.y, start.z);
                            vertices.push(end.x, end.y, end.z);
                        }
                    }
                }
            }

            geometry = new PolylineGeometry();
            geometry.setPositions(vertices);
        }

        if (!material) {
            material = new PolylineMaterial({
                color,
                lineWidth
            });
        }

        super(geometry, material);
    }
}

function isUniqueEdge(start, end, edges) {
    const hash1 = `${start.x},${start.y},${start.z}-${end.x},${end.y},${end.z}`;
    const hash2 = `${end.x},${end.y},${end.z}-${start.x},${start.y},${start.z}`; // Coincident edge

    if (edges.has(hash1) || edges.has(hash2)) {
        return false;
    } else {
        edges.add(hash1);
        edges.add(hash2);
        return true;
    }
}
