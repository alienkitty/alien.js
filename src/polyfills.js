/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (typeof Promise !== 'undefined') Promise.create = () => {
    let resolve,
        reject,
        promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

Array.prototype.remove = function (element) {
    let index = this.indexOf(element);
    if (~index) return this.splice(index, 1);
};

String.prototype.includes = function (str) {
    if (!Array.isArray(str)) return ~this.indexOf(str);
    for (let i = str.length - 1; i >= 0; i--) if (~this.indexOf(str[i])) return true;
    return false;
};

if (!window.fetch) window.fetch = (url, options = {}) => {
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
        request.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm, (m, key, value) => {
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

window.get = (url, options = {}) => {
    let promise = Promise.create();
    options.method = 'GET';
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(text => {
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

window.post = (url, body, options = {}) => {
    let promise = Promise.create();
    options.method = 'POST';
    options.body = JSON.stringify(body);
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(text => {
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
