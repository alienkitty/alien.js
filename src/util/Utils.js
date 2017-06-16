/**
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { DynamicObject } from './DynamicObject';

class Utils {

    rand(min, max) {
        return (new DynamicObject({v:min})).lerp({v:max}, Math.random()).v;
    }

    doRandom(min, max, precision) {
        if (typeof precision === 'number') {
            let p = Math.pow(10, precision);
            return Math.round(this.rand(min, max) * p) / p;
        } else {
            return Math.round(this.rand(min - 0.5, max + 0.5));
        }
    }

    headsTails(heads, tails) {
        return !this.doRandom(0, 1) ? heads : tails;
    }

    toDegrees(rad) {
        return rad * (180 / Math.PI);
    }

    toRadians(deg) {
        return deg * (Math.PI / 180);
    }

    findDistance(p1, p2) {
        let dx = p2.x - p1.x,
            dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    timestamp() {
        return (Date.now() + this.doRandom(0, 99999)).toString();
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    constrain(num, min, max) {
        return Math.min(Math.max(num, Math.min(min, max)), Math.max(min, max));
    }

    convertRange(oldValue, oldMin, oldMax, newMin, newMax, constrain) {
        let oldRange = oldMax - oldMin,
            newRange = newMax - newMin,
            newValue = (oldValue - oldMin) * newRange / oldRange + newMin;
        return constrain ? this.constrain(newValue, newMin, newMax) : newValue;
    }

    nullObject(object) {
        for (let key in object) if (typeof object[key] !== 'undefined') object[key] = null;
        return null;
    }

    cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    mergeObject(...objects) {
        let object = {};
        for (let obj of objects) for (let key in obj) object[key] = obj[key];
        return object;
    }

    cloneArray(array) {
        return array.slice(0);
    }

    queryString(key) {
        return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
    }
}

export { Utils };
