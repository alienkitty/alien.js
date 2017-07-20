/**
 * Storage helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Storage = new ( // Singleton pattern

class Storage {

    constructor() {
        let storage;

        testStorage();

        function testStorage() {
            if (window.localStorage) {
                try {
                    window.localStorage['test'] = 1;
                    window.localStorage.removeItem('test');
                    storage = true;
                } catch (e) {
                    storage = false;
                }
            } else {
                storage = false;
            }
        }

        function cookie(key, value, expires) {
            let options;
            if (arguments.length > 1 && (value === null || typeof value !== 'object')) {
                options = {};
                options.path = '/';
                options.expires = expires || 1;
                if (value === null) options.expires = -1;
                if (typeof options.expires === 'number') {
                    let days = options.expires,
                        t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }
                return document.cookie = [encodeURIComponent(key), '=', encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', '; path=' + options.path].join('');
            }
            options = value || {};
            let result,
                decode = options.raw ? s => {
                    return s;
                } : decodeURIComponent;
            return result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie) ? decode(result[1]) : null;
        }

        this.setCookie = (key, value, expires) => {
            cookie(key, value, expires);
        };

        this.getCookie = key => {
            return cookie(key);
        };

        this.set = (key, value) => {
            if (value !== null && typeof value === 'object') value = JSON.stringify(value);
            if (storage) {
                if (value === null) window.localStorage.removeItem(key);
                else window.localStorage[key] = value;
            } else {
                cookie(key, value, 365);
            }
        };

        this.get = key => {
            let value;
            if (storage) value = window.localStorage[key];
            else value = cookie(key);
            if (value) {
                let char0;
                if (value.charAt) char0 = value.charAt(0);
                if (char0 === '{' || char0 === '[') value = JSON.parse(value);
                if (value === 'true' || value === 'false') value = value === 'true';
            }
            return value;
        };
    }
}

)(); // Singleton pattern

export { Storage };
