/**
 * Storage helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Storage {

    set(key, value) {
        if (value !== null && typeof value === 'object') value = JSON.stringify(value);
        if (value === null) window.localStorage.removeItem(key);
        else window.localStorage[key] = value;
    }

    get(key) {
        let value = window.localStorage[key];
        if (value) {
            let char0;
            if (value.charAt) char0 = value.charAt(0);
            if (char0 === '{' || char0 === '[') value = JSON.parse(value);
            if (value === 'true' || value === 'false') value = value === 'true';
        }
        return value;
    }
}

export { Storage };
