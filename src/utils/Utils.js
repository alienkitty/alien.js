/**
 * @author pschroen / https://ufo.ai/
 */

import { randInt } from 'three/src/math/MathUtils.js';

export * from 'three/src/math/MathUtils.js';

export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function headsTails(heads, tails) {
    return randInt(0, 1) ? tails : heads;
}

export function guid() {
    return (Date.now() + randInt(0, 99999)).toString();
}

export function brightness(color) {
    return color.r * 0.3 + color.g * 0.59 + color.b * 0.11;
}

export function basename(path, ext) {
    const name = path.split('/').pop().split('?')[0];

    return !ext ? name.split('.')[0] : name;
}

export function extension(path) {
    return path.split('.').pop().split('?')[0].toLowerCase();
}

export function absolute(path) {
    if (path.includes('//')) {
        return path;
    }

    const port = Number(location.port) > 1000 ? ':' + location.port : '';

    return location.protocol + '//' + location.hostname + port + location.pathname.replace(/\/[^/]*$/, '/') + path;
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function getConstructor(object) {
    const isInstance = typeof object !== 'function';
    const code = isInstance ? object.constructor.toString() : object.toString();
    const name = code.match(/(?:class|function)\s([^\s{(]+)/)[1];

    return { name, code, isInstance };
}
