/**
 * XMLHttpRequest helper class with promise support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class XHR {

    constructor() {
        this.headers = {};
        this.options = {};
        let serial = [];

        let serialize = (key, data) => {
            if (typeof data === 'object') {
                for (let i in data) {
                    let newKey = key + '[' + i + ']';
                    if (typeof data[i] === 'object') serialize(newKey, data[i]);
                    else serial.push(newKey + '=' + data[i]);
                }
            } else {
                serial.push(key + '=' + data);
            }
        };

        this.get = (url, data, callback, type) => {
            if (typeof data === 'function') {
                type = callback;
                callback = data;
                data = null;
            } else if (typeof data === 'object') {
                for (let key in data) serialize(key, data[key]);
                data = serial.join('&');
                data = data.replace(/\[/g, '%5B');
                data = data.replace(/\]/g, '%5D');
                serial = null;
                url += '?' + data;
            }
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            if (type === 'arraybuffer') xhr.responseType = 'arraybuffer';
            if (type === 'blob') xhr.responseType = 'blob';
            if (type === 'text') xhr.overrideMimeType('text/plain');
            if (type === 'json') xhr.setRequestHeader('Accept', 'application/json');
            for (let key in this.headers) xhr.setRequestHeader(key, this.headers[key]);
            for (let key in this.options) xhr[key] = this.options[key];
            let promise = null;
            if (typeof Promise !== 'undefined') {
                promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
            }
            xhr.send();
            xhr.onreadystatechange = () => {
                if (callback) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        if (type === 'arraybuffer' || type === 'blob') callback(xhr.response);
                        else if (type === 'text') callback(xhr.responseText);
                        else callback(JSON.parse(xhr.responseText));
                    } else if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                        if (promise) promise.reject(xhr);
                        else callback(xhr);
                    }
                }
            };
            return promise || xhr;
        };

        this.post = (url, data, callback, type) => {
            if (typeof data === 'function') {
                type = callback;
                callback = data;
                data = null;
            } else if (typeof data === 'object') {
                if (type === 'json') {
                    data = JSON.stringify(data);
                } else {
                    for (let key in data) serialize(key, data[key]);
                    data = serial.join('&');
                    data = data.replace(/\[/g, '%5B');
                    data = data.replace(/\]/g, '%5D');
                    serial = null;
                }
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            if (type === 'arraybuffer') xhr.responseType = 'arraybuffer';
            if (type === 'blob') xhr.responseType = 'blob';
            if (type === 'text') xhr.overrideMimeType('text/plain');
            if (type === 'json') xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded');
            for (let key in this.headers) xhr.setRequestHeader(key, this.headers[key]);
            for (let key in this.options) xhr[key] = this.options[key];
            let promise = null;
            if (typeof Promise !== 'undefined') {
                promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
            }
            xhr.send();
            xhr.onreadystatechange = () => {
                if (callback) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        if (type === 'arraybuffer' || type === 'blob') callback(xhr.response);
                        else if (type === 'text') callback(xhr.responseText);
                        else callback(JSON.parse(xhr.responseText));
                    } else if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                        if (promise) promise.reject(xhr);
                        else callback(xhr);
                    }
                }
            };
            return promise || xhr;
        };
    }
}

export { XHR };
