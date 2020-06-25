/**
 * @author pschroen / https://ufo.ai/
 */

export function degrees(radians) {
    return radians * (180 / Math.PI);
}

export function radians(degrees) {
    return degrees * (Math.PI / 180);
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function range(value, oldMin, oldMax, newMin, newMax, isClamp) {
    const newValue = (value - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;

    if (isClamp) {
        return clamp(newValue, newMin, newMax);
    }

    return newValue;
}

export function random(min, max, precision = 0) {
    const multiplier = Math.pow(10, precision);

    return Math.round((Math.random() * (max - min) + min) * multiplier) / multiplier;
}

export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
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

export function getConstructorName(obj) {
    const code = typeof obj !== 'function' ? obj.constructor.toString() : obj.toString();

    return code.match(/(?:class|function)\s([^\s{(]+)/)[1];
}

export function createElementFromHTML(str) {
    const div = document.createElement('div');

    div.innerHTML = str.trim();

    return div.firstChild;
}
