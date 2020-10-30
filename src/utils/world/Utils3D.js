/**
 * @author pschroen / https://ufo.ai/
 */

import { BufferAttribute, BufferGeometry, MathUtils } from 'three';

export function getFullscreenTriangle() {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

    geometry.setAttribute('position', new BufferAttribute(vertices, 2));
    geometry.setAttribute('uv', new BufferAttribute(uvs, 2));

    return geometry;
}

export function getFrustum(camera, offsetZ = 0) {
    const fov = MathUtils.degToRad(camera.fov);
    const height = 2 * Math.tan(fov / 2) * (camera.position.z - offsetZ);
    const width = height * camera.aspect;

    return { width, height };
}
