/**
 * @author pschroen / https://ufo.ai/
 */

import { BoxGeometry, BufferAttribute, BufferGeometry, MathUtils, Vector3 } from 'three';

export function getFullscreenTriangle() {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

    geometry.setAttribute('position', new BufferAttribute(vertices, 2));
    geometry.setAttribute('uv', new BufferAttribute(uvs, 2));

    return geometry;
}

export function getSphericalCube(radius, segments) {
    const geometry = new BoxGeometry(radius, radius, radius, segments, segments, segments);
    const vertices = geometry.attributes.position;
    const normals = geometry.attributes.normal;

    for (let i = 0; i < vertices.count; i++) {
        const v = new Vector3().fromArray(vertices.array, i * 3);
        v.normalize();
        normals.setXYZ(i, v.x, v.y, v.z);
        v.setLength(radius);
        vertices.setXYZ(i, v.x, v.y, v.z);
    }

    return geometry;
}

export function getFrustum(camera, offsetZ = 0) {
    const fov = MathUtils.degToRad(camera.fov);
    const height = 2 * Math.tan(fov / 2) * (camera.position.z - offsetZ);
    const width = height * camera.aspect;

    return { width, height };
}
