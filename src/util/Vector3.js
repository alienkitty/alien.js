/**
 * 3D vector.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interpolation } from '../tween/Interpolation';
import { Vector2 } from './Vector2';

class Vector3 {

    constructor(x, y, z, w) {
        this.x = typeof x === 'number' ? x : 0;
        this.y = typeof y === 'number' ? y : 0;
        this.z = typeof z === 'number' ? z : 0;
        this.w = typeof w === 'number' ? w : 1;
        this.type = 'vector3';
    }

    set(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 1;
        return this;
    }

    clear() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        return this;
    }

    copyTo(p) {
        p.x = this.x;
        p.y = this.y;
        p.z = this.z;
        p.w = this.w;
        return p;
    }

    copyFrom(p) {
        this.x = p.x || 0;
        this.y = p.y || 0;
        this.z = p.z || 0;
        this.w = p.w || 1;
        return this;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalize() {
        let m = 1 / this.length();
        this.set(this.x * m, this.y * m, this.z * m);
        return this;
    }

    setLength(length) {
        this.normalize().multiply(length);
        return this;
    }

    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    multiply(v) {
        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;
    }

    divide(v) {
        this.x /= v;
        this.y /= v;
        this.z /= v;
        return this;
    }

    limit(max) {
        if (this.length() > max) {
            this.normalize();
            this.multiply(max);
        }
    }

    heading2D() {
        return -Math.atan2(-this.y, this.x);
    }

    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }

    deltaLerp(v, alpha, delta = 1) {
        for (let i = 0; i < delta; i++) this.lerp(v, alpha);
        return this;
    }

    interp(v, alpha, ease, dist = 5000) {
        if (!this.calc) this.calc = new Vector3();
        this.calc.subVectors(this, v);
        let f = Interpolation.convertEase(ease),
            a = f(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
        return this.lerp(v, a);
    }

    setAngleRadius(a, r) {
        this.x = Math.cos(a) * r;
        this.y = Math.sin(a) * r;
        this.z = Math.sin(a) * r;
        return this;
    }

    addAngleRadius(a, r) {
        this.x += Math.cos(a) * r;
        this.y += Math.sin(a) * r;
        this.z += Math.sin(a) * r;
        return this;
    }

    applyQuaternion(q) {
        let x = this.x,
            y = this.y,
            z = this.z,
            qx = q.x,
            qy = q.y,
            qz = q.z,
            qw = q.w,
            ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    }

    dot(a, b = this) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    cross(a, b = this) {
        let x = a.y * b.z - a.z * b.y,
            y = a.z * b.x - a.x * b.z,
            z = a.x * b.y - a.y * b.x;
        this.set(x, y, z, this.w);
        return this;
    }

    distanceTo(v, noSq) {
        let dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;
        if (!noSq) return Math.sqrt(dx * dx + dy * dy + dz * dz);
        return dx * dx + dy * dy + dz * dz;
    }

    solveAngle(a, b = this) {
        return Math.acos(a.dot(b) / (a.length() * b.length() || 0.00001));
    }

    solveAngle2D(a, b = this) {
        let calc = new Vector2(),
            calc2 = new Vector2();
        calc.copyFrom(a);
        calc2.copyFrom(b);
        return calc.solveAngle(calc2);
    }

    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    toString(split = ' ') {
        return this.x + split + this.y + split + this.z;
    }
}

export { Vector3 };
