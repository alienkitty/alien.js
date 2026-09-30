/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/three-sketches/blob/main/surface-flow/src/SurfaceWalker.js
 */

import { Matrix4, Plane, Ray, Triangle, Vector3 } from 'three';

import { HalfEdgeMap } from './HalfEdgeMap.js';

const _vector0 = new Vector3();
const _vector1 = new Vector3();
const _ray = new Ray();

const _plane = new Plane();
const _matrix = new Matrix4();
const _planeNormal = new Vector3();

function rotationBetweenTriangles(fromTri, toTri, target) {
    _vector0.crossVectors(fromTri.normal, toTri.normal).normalize();

    const angle = fromTri.normal.angleTo(toTri.normal);
    target.makeRotationAxis(_vector0, angle);

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
        _vector0.subVectors(this.b, this.a).normalize();
        _vector1.crossVectors(_vector0, this.normal).normalize();

        this.transform.makeBasis(_vector0, _vector1, this.normal).setPosition(this.a);
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

            _vector0.addVectors(v0, this.normal);
            _plane.setFromCoplanarPoints(v0, v1, _vector0);

            const side = Math.sign(_plane.distanceToPoint(ray.origin));

            if (side !== -1) {
                continue;
            }

            const planeDist = ray.distanceToPlane(_plane);

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

        return this;
    }
}

export class SurfacePoint extends Vector3 {
    constructor(...args) {
        super(...args);

        this.index = -1;
    }
}

const _frame0 = new TriangleFrame();
const _frame1 = new TriangleFrame();

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
        this.getFrame(p.index, _frame0);

        let dist = dir.length();
        _ray.direction.copy(dir);
        _ray.origin.copy(p);

        _frame0.projectDirection(_ray.direction);
        _frame0.projectPoint(_ray.origin);

        targetPoint.index = p.index;

        while (dist > 0) {
            const edgeIndex = _frame0.intersectEdge(_ray, targetPoint);

            if (edgeIndex === -1) {
                break;
            }

            const index = this.halfEdgeMap.getSiblingTriangleIndex(targetPoint.index, edgeIndex);
            const hitDist = _ray.origin.distanceTo(targetPoint);

            if (hitDist < dist) {
                dist -= hitDist;

                this.getFrame(index, _frame1);
                targetPoint.index = index;

                if (this.planarWalk) {
                    _planeNormal.crossVectors(_ray.direction, _frame0.normal);
                }

                rotationBetweenTriangles(_frame0, _frame1, _matrix);
                _ray.direction.transformDirection(_matrix);
                _ray.origin.copy(targetPoint);

                if (this.planarWalk) {
                    const v = _planeNormal.dot(_ray.direction);
                    _ray.direction.addScaledVector(_planeNormal, -v);
                }

                _frame0.copy(_frame1);

                if (edgeHitCallback) {
                    edgeHitCallback(_ray.origin);
                }
            } else {
                _ray.at(dist, targetPoint);
                break;
            }
        }

        if (targetDir) {
            targetDir.copy(_ray.direction);
        }

        if (targetNormal) {
            targetNormal.copy(_frame0.normal);
        }
    }
}
