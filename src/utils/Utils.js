/**
 * @author pschroen / https://ufo.ai/
 */

export function degrees(radians) {
    return radians * 180 / Math.PI;
}

export function radians(degrees) {
    return degrees * Math.PI / 180;
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function range(value, oldMin, oldMax, newMin, newMax, isClamp) {
    const newValue = ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;

    if (isClamp) {
        return clamp(newValue, Math.min(newMin, newMax), Math.max(newMin, newMax));
    }

    return newValue;
}

export function mix(a, b, alpha) {
    return a * (1 - alpha) + b * alpha;
}

export function step(edge, value) {
    return value < edge ? 0 : 1;
}

export function smoothStep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));

    return x * x * (3 - 2 * x);
}

export function fract(value) {
    return value - Math.floor(value);
}

export function lerp(value, target, alpha) {
    return value + (target - value) * alpha;
}

export function mod(value, n) {
    return (value % n + n) % n;
}

export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function random(min, max, precision = 0) {
    const multiplier = Math.pow(10, precision);

    return Math.round((Math.random() * (max - min) + min) * multiplier) / multiplier;
}

export function headsTails(heads, tails) {
    return random(0, 1) ? tails : heads;
}

export function guid() {
    return (Date.now() + random(0, 99999)).toString();
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

export function queryString(key) {
    const str = decodeURI(location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[.+*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));

    if (!str.length || str === '0' || str === 'false') {
        return false;
    }

    return str;
}

export function getConstructor(obj) {
    const isInstance = typeof obj !== 'function';
    const code = isInstance ? obj.constructor.toString() : obj.toString();
    const name = code.match(/(?:class|function)\s([^\s{(]+)/)[1];

    return { name, code, isInstance };
}
