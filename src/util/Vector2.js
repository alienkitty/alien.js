/**
 * 2D vector.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interpolation } from '../tween/Interpolation';

class Vector2 {

    constructor(x, y) {
        this.x = typeof x === 'number' ? x : 0;
        this.y = typeof y === 'number' ? y : 0;
        this.type = 'vector2';
    }

    set(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        return this;
    }

    clear() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    copyTo(v) {
        v.x = this.x;
        v.y = this.y;
        return this;
    }

    copyFrom(v) {
        this.x = v.x || 0;
        this.y = v.y || 0;
        return this;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y || 0.00001;
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    }

    setLength(length) {
        this.normalize().multiply(length);
        return this;
    }

    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }

    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }

    multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(v) {
        this.x *= v;
        this.y *= v;
        return this;
    }

    divide(v) {
        this.x /= v;
        this.y /= v;
        return this;
    }

    perpendicular() {
        const tx = this.x,
            ty = this.y;
        this.x = -ty;
        this.y = tx;
        return this;
    }

    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    }

    deltaLerp(v, alpha, delta = 1) {
        for (let i = 0; i < delta; i++) this.lerp(v, alpha);
        return this;
    }

    interp(v, alpha, ease, dist = 5000) {
        if (!this.calc) this.calc = new Vector2();
        this.calc.subVectors(this, v);
        const fn = Interpolation.convertEase(ease),
            a = fn(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
        return this.lerp(v, a);
    }

    setAngleRadius(a, r) {
        this.x = Math.cos(a) * r;
        this.y = Math.sin(a) * r;
        return this;
    }

    addAngleRadius(a, r) {
        this.x += Math.cos(a) * r;
        this.y += Math.sin(a) * r;
        return this;
    }

    dot(a, b = this) {
        return a.x * b.x + a.y * b.y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    distanceTo(v, noSq) {
        const dx = this.x - v.x,
            dy = this.y - v.y;
        if (!noSq) return Math.sqrt(dx * dx + dy * dy);
        return dx * dx + dy * dy;
    }

    solveAngle(a, b = this) {
        return Math.atan2(a.y - b.y, a.x - b.x);
    }

    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    toString(split = ' ') {
        return this.x + split + this.y;
    }
}

export { Vector2 };
