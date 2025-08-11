/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/three-sketches/blob/main/surface-flow/src/SurfaceWalker.js
 */

import { Matrix4, Plane, Ray, Triangle, Vector3 } from 'three';

import { HalfEdgeMap } from './HalfEdgeMap.js';

const vec0 = new Vector3();
const vec1 = new Vector3();
const ray = new Ray();

const plane = new Plane();
const mat = new Matrix4();
const planeNormal = new Vector3();

function rotationBetweenTriangles(fromTri, toTri, target) {
    vec0.crossVectors(fromTri.normal, toTri.normal).normalize();

    const angle = fromTri.normal.angleTo(toTri.normal);
    target.makeRotationAxis(vec0, angle);

    return target;
}

export class TriangleFrame extends Triangle {
    constructor() {
        super();

        this.normal = new Vector3();
        this.transform = new Matrix4();
        this.invTransform = new Matrix4();
        this.vertices = [this.a, this.b, this.c];
    }

    update() {
        this.getNormal(this.normal);
        vec0.subVectors(this.b, this.a).normalize();
        vec1.crossVectors(vec0, this.normal).normalize();

        this.transform.makeBasis(vec0, vec1, this.normal).setPosition(this.a);
        this.invTransform.copy(this.transform).invert();
    }

    projectPoint(target) {
        target.applyMatrix4(this.invTransform);
        target.z = 0;
        target.applyMatrix4(this.transform);

        return target;
    }

    projectDirection(target) {
        target.transformDirection(this.invTransform);
        target.z = 0;
        target.transformDirection(this.transform);

        return target;
    }

    intersectEdge(ray, target) {
        let dist = Infinity;
        let index = -1;

        for (let i = 0; i < 3; i++) {
            const i0 = i;
            const i1 = (i + 1) % 3;

            const v0 = this.vertices[i0];
            const v1 = this.vertices[i1];

            vec0.addVectors(v0, this.normal);
            plane.setFromCoplanarPoints(v0, v1, vec0);

            const side = Math.sign(plane.distanceToPoint(ray.origin));

            if (side !== -1) {
                continue;
            }

            const planeDist = ray.distanceToPlane(plane);

            if (planeDist !== null && planeDist < dist) {
                dist = planeDist;
                index = i;
            }
        }

        ray.at(dist, target);

        return index;
    }

    copy(source) {
        super.copy(source);

        this.normal.copy(source.normal);
        this.transform.copy(source.transform);
        this.invTransform.copy(source.invTransform);
    }
}

export class SurfacePoint extends Vector3 {
    constructor(...args) {
        super(...args);

        this.index = -1;
    }
}

const frame0 = new TriangleFrame();
const frame1 = new TriangleFrame();

/**
 * A class to walk along a mesh surface using a half-edge geometry structure.
 */
export class SurfaceWalker {
    constructor(geometry) {
        this.halfEdgeMap = new HalfEdgeMap(geometry);
        this.geometry = geometry;
        this.planarWalk = false;
    }

    getFrame(index, target) {
        const indexAttr = this.geometry.index;
        const position = this.geometry.attributes.position;

        let i0 = 3 * index + 0;
        let i1 = 3 * index + 1;
        let i2 = 3 * index + 2;

        if (indexAttr) {
            i0 = indexAttr.getX(i0);
            i1 = indexAttr.getX(i1);
            i2 = indexAttr.getX(i2);
        }

        target.a.fromBufferAttribute(position, i0);
        target.b.fromBufferAttribute(position, i1);
        target.c.fromBufferAttribute(position, i2);

        target.update();
    }

    movePoint(p, dir, targetPoint, targetDir, targetNormal, edgeHitCallback) {
        this.getFrame(p.index, frame0);

        let dist = dir.length();
        ray.direction.copy(dir);
        ray.origin.copy(p);

        frame0.projectDirection(ray.direction);
        frame0.projectPoint(ray.origin);

        targetPoint.index = p.index;

        while (dist > 0) {
            const edgeIndex = frame0.intersectEdge(ray, targetPoint);

            if (edgeIndex === -1) {
                break;
            }

            const index = this.halfEdgeMap.getSiblingTriangleIndex(targetPoint.index, edgeIndex);
            const hitDist = ray.origin.distanceTo(targetPoint);

            if (hitDist < dist) {
                dist -= hitDist;

                this.getFrame(index, frame1);
                targetPoint.index = index;

                if (this.planarWalk) {
                    planeNormal.crossVectors(ray.direction, frame0.normal);
                }

                rotationBetweenTriangles(frame0, frame1, mat);
                ray.direction.transformDirection(mat);
                ray.origin.copy(targetPoint);

                if (this.planarWalk) {
                    const v = planeNormal.dot(ray.direction);
                    ray.direction.addScaledVector(planeNormal, -v);
                }

                frame0.copy(frame1);

                if (edgeHitCallback) {
                    edgeHitCallback(ray.origin);
                }
            } else {
                ray.at(dist, targetPoint);
                break;
            }
        }

        if (targetDir) {
            targetDir.copy(ray.direction);
        }

        if (targetNormal) {
            targetNormal.copy(frame0.normal);
        }
    }
}
