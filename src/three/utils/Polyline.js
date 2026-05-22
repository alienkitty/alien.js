/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://oframe.github.io/ogl/examples/?src=polylines.html by gordonnl
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
        lineWidth,
        miter
    } = {}) {
        const geometry = new BufferGeometry();

        if (!material) {
            material = new PolylineMaterial({
                color,
                lineWidth,
                miter
            });
        }

        super(geometry, material);

        this.points = points;

        this.v = new Vector3();

        this.createGeometry();
    }

    createGeometry() {
        const count = this.points.length;

        // Create buffers
        const position = new Float32Array(count * 3 * 2);
        const prev = new Float32Array(count * 3 * 2);
        const next = new Float32Array(count * 3 * 2);
        const side = new Float32Array(count * 1 * 2);
        const uv = new Float32Array(count * 2 * 2);
        const index = new Uint16Array((count - 1) * 3 * 2);

        // Set static buffers
        for (let i = 0; i < count; i++) {
            side.set([-1, 1], i * 2);
            const v = i / (count - 1);
            uv.set([0, v, 1, v], i * 4);

            if (i === count - 1) {
                continue;
            }

            const ind = i * 2;
            index.set([ind + 0, ind + 1, ind + 2], (ind + 0) * 3);
            index.set([ind + 2, ind + 1, ind + 3], (ind + 1) * 3);
        }

        this.geometry.setAttribute('position', new BufferAttribute(position, 3));
        this.geometry.setAttribute('prev', new BufferAttribute(prev, 3));
        this.geometry.setAttribute('next', new BufferAttribute(next, 3));
        this.geometry.setAttribute('side', new BufferAttribute(side, 1));
        this.geometry.setAttribute('uv', new BufferAttribute(uv, 2));
        this.geometry.setIndex(new BufferAttribute(index, 1));

        // Populate dynamic buffers
        this.updateGeometry();
    }

    updateGeometry() {
        const position = this.geometry.attributes.position.array;
        const prev = this.geometry.attributes.prev.array;
        const next = this.geometry.attributes.next.array;

        this.points.forEach((p, i) => {
            p.toArray(position, i * 3 * 2);
            p.toArray(position, i * 3 * 2 + 3);

            // If first point, calculate prev using the distance to 2nd point
            if (!i) {
                this.v.copy(p)
                    .sub(this.points[i + 1])
                    .add(p);
                this.v.toArray(prev, i * 3 * 2);
                this.v.toArray(prev, i * 3 * 2 + 3);
            } else {
                p.toArray(next, (i - 1) * 3 * 2);
                p.toArray(next, (i - 1) * 3 * 2 + 3);
            }

            // If last point, calculate next using distance to 2nd last point
            if (i === this.points.length - 1) {
                this.v.copy(p)
                    .sub(this.points[i - 1])
                    .add(p);
                this.v.toArray(next, i * 3 * 2);
                this.v.toArray(next, i * 3 * 2 + 3);
            } else {
                p.toArray(prev, (i + 1) * 3 * 2);
                p.toArray(prev, (i + 1) * 3 * 2 + 3);
            }
        });

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.prev.needsUpdate = true;
        this.geometry.attributes.next.needsUpdate = true;
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
