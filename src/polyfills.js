/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (typeof Promise !== 'undefined') Promise.create = function () {
    let resolve,
        reject,
        promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

Math.sign = function (x) {
    x = +x;
    if (x === 0 || isNaN(x)) return Number(x);
    return x > 0 ? 1 : -1;
};

Math.degrees = function (radians) {
    return radians * (180 / Math.PI);
};

Math.radians = function (degrees) {
    return degrees * (Math.PI / 180);
};

Math.clamp = function (value, min = 0, max = 1) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

Math.range = function (value, oldMin = -1, oldMax = 1, newMin = 0, newMax = 1, isClamp) {
    const newValue = (value - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    if (isClamp) return Math.clamp(newValue, newMin, newMax);
    return newValue;
};

Math.mix = function (a, b, alpha) {
    return a * (1 - alpha) + b * alpha;
};

Math.step = function (edge, value) {
    return value < edge ? 0 : 1;
};

Math.smoothStep = function (min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

Math.fract = function (value) {
    return value - Math.floor(value);
};

Math.mod = function (value, n) {
    return (value % n + n) % n;
};

Array.prototype.remove = function (element) {
    let index = this.indexOf(element);
    if (~index) return this.splice(index, 1);
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

String.prototype.includes = function (str) {
    if (!Array.isArray(str)) return ~this.indexOf(str);
    for (let i = 0; i < str.length; i++) if (~this.indexOf(str[i])) return true;
    return false;
};

String.prototype.clip = function (num, end) {
    return this.length > num ? this.slice(0, num) + end : this;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function (find, replace) {
    return this.split(find).join(replace);
};

if (!window.fetch) window.fetch = function (url, options = {}) {
    let promise = Promise.create(),
        request = new XMLHttpRequest();
    request.open(options.method || 'GET', url);
    for (let i in options.headers) request.setRequestHeader(i, options.headers[i]);
    request.onload = () => promise.resolve(response());
    request.onerror = promise.reject;
    request.send(options.body);

    function response() {
        let keys = [],
            all = [],
            headers = {},
            header;
        request.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm, function (m, key, value) {
            keys.push(key = key.toLowerCase());
            all.push([key, value]);
            header = headers[key];
            headers[key] = header ? `${header},${value}` : value;
        });
        return {
            ok: (request.status / 200 | 0) == 1,
            status: request.status,
            statusText: request.statusText,
            url: request.responseURL,
            clone: response,
            text() { return Promise.resolve(request.responseText); },
            json() { return Promise.resolve(request.responseText).then(JSON.parse); },
            xml() { return Promise.resolve(request.responseXML); },
            blob() { return Promise.resolve(new Blob([request.response])); },
            arrayBuffer() { return Promise.resolve(new ArrayBuffer([request.response])); },
            headers: {
                keys() { return keys; },
                entries() { return all; },
                get(n) { return headers[n.toLowerCase()]; },
                has(n) { return n.toLowerCase() in headers; }
            }
        };
    }
    return promise;
};

window.get = function (url, options = {}) {
    let promise = Promise.create();
    options.method = 'GET';
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(function (text) {
            if (text.charAt(0).includes(['[', '{'])) {
                try {
                    promise.resolve(JSON.parse(text));
                } catch (err) {
                    promise.resolve(text);
                }
            } else {
                promise.resolve(text);
            }
        });
    }
    return promise;
};

window.post = function (url, body, options = {}) {
    let promise = Promise.create();
    options.method = 'POST';
    options.body = JSON.stringify(body);
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(function (text) {
            if (text.charAt(0).includes(['[', '{'])) {
                try {
                    promise.resolve(JSON.parse(text));
                } catch (err) {
                    promise.resolve(text);
                }
            } else {
                promise.resolve(text);
            }
        });
    }
    return promise;
};

window.getURL = function (url, target = '_blank') {
    window.open(url, target);
};

if (!window.URL) window.URL = window.webkitURL;

if (!window.Config) window.Config = {};
if (!window.Global) window.Global = {};
