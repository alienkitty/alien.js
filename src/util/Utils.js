/**
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Utils {

    random(min, max, precision = 0) {
        if (typeof min === 'undefined') return Math.random();
        if (min === max) return min;
        min = min || 0;
        max = max || 1;
        const p = Math.pow(10, precision);
        return Math.round((min + Math.random() * (max - min)) * p) / p;
    }

    headsTails(heads, tails) {
        return this.random(0, 1) ? tails : heads;
    }

    queryString(key) {
        const str = decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[.+*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
        if (!str.length || str === '0' || str === 'false') return false;
        return str;
    }

    getConstructorName(object) {
        return object.constructor.name || object.constructor.toString().match(/function ([^(]+)/)[1];
    }

    nullObject(object) {
        for (let key in object) if (typeof object[key] !== 'undefined') object[key] = null;
        return null;
    }

    cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    mergeObject(...objects) {
        const object = {};
        for (let obj of objects) for (let key in obj) object[key] = obj[key];
        return object;
    }

    toArray(object) {
        return Object.keys(object).map(key => {
            return object[key];
        });
    }

    cloneArray(array) {
        return array.slice(0);
    }

    basename(path, ext) {
        const name = path.split('/').last();
        return !ext ? name.split('.')[0] : name;
    }

    extension(path) {
        return path.split('.').last().split('?')[0].toLowerCase();
    }

    base64(str) {
        return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));
    }

    timestamp() {
        return (Date.now() + this.random(0, 99999)).toString();
    }

    pad(number) {
        return number < 10 ? '0' + number : number;
    }
}

export { Utils };
