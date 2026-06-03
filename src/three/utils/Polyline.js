/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineMaterial.js by WestLangley
 * Based on https://github.com/mattdesl/webgl-lines
 * Based on https://oframe.github.io/ogl/examples/?src=polylines.html by gordonnl
 * Based on https://github.com/range-et/PGL
 */

import { BufferAttribute, BufferGeometry, Mesh, Vector3 } from 'three';

import { PolylineMaterial } from '../materials/PolylineMaterial.js';

/**
 * A class for a polyline mesh.
 */
export class Polyline extends Mesh {
    constructor({
        points,
        material,
        color,
        lineWidth
    } = {}) {
        const geometry = new BufferGeometry();

        if (!material) {
            material = new PolylineMaterial({
                color,
                lineWidth
            });
        }

        super(geometry, material);

        this.points = points;

        this.v = new Vector3();

        this.createGeometry();
    }

    createGeometry() {
        this.count = this.points.length;

        // Create buffers
        const position = new Float32Array(this.count * 3 * 2);
        const start = new Float32Array(this.count * 3 * 2);
        const end = new Float32Array(this.count * 3 * 2);
        const side = new Float32Array(this.count * 1 * 2);
        const uv = new Float32Array(this.count * 2 * 2);
        const index = new Uint16Array((this.count - 1) * 3 * 2);

        // Set static buffers
        for (let i = 0; i < this.count; i++) {
            side.set([-1, 1], i * 2);
            const v = i / (this.count - 1);
            uv.set([0, v, 1, v], i * 4);

            if (i === this.count - 1) {
                continue;
            }

            const a = i * 2;
            index.set([a + 0, a + 1, a + 2], (a + 0) * 3);
            index.set([a + 2, a + 1, a + 3], (a + 1) * 3);
        }

        this.geometry.setAttribute('position', new BufferAttribute(position, 3));
        this.geometry.setAttribute('positionStart', new BufferAttribute(start, 3));
        this.geometry.setAttribute('positionEnd', new BufferAttribute(end, 3));
        this.geometry.setAttribute('side', new BufferAttribute(side, 1));
        this.geometry.setAttribute('uv', new BufferAttribute(uv, 2));
        this.geometry.setIndex(new BufferAttribute(index, 1));

        // Populate dynamic buffers
        this.updateGeometry();
    }

    updateGeometry() {
        const position = this.geometry.attributes.position.array;
        const start = this.geometry.attributes.positionStart.array;
        const end = this.geometry.attributes.positionEnd.array;

        for (let i = 0; i < this.count; i++) {
            const p = this.points[i];
            const pStart = i > 0 ? this.points[i - 1] : p;
            const pEnd = i < this.count - 1 ? this.points[i + 1] : p;

            // Left edge vertex
            p.toArray(position, i * 3 * 2);
            pStart.toArray(start, i * 3 * 2);
            pEnd.toArray(end, i * 3 * 2);

            // Right edge vertex
            p.toArray(position, i * 3 * 2 + 3);
            pStart.toArray(start, i * 3 * 2 + 3);
            pEnd.toArray(end, i * 3 * 2 + 3);
        }

        this.geometry.computeBoundingSphere();

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.positionStart.needsUpdate = true;
        this.geometry.attributes.positionEnd.needsUpdate = true;
    }

    destroy() {
        this.material.dispose();
        this.geometry.dispose();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
