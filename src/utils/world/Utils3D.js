/**
 * @author pschroen / https://ufo.ai/
 */

import { BufferAttribute, BufferGeometry } from 'three';

export function getFullscreenTriangle() {
    const geometry = new BufferGeometry();
    const position = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    const uv = new Float32Array([0, 0, 2, 0, 0, 2]);

    geometry.setAttribute('position', new BufferAttribute(position, 3));
    geometry.setAttribute('uv', new BufferAttribute(uv, 2));

    return geometry;
}
