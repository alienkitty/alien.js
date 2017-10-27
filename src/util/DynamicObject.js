/**
 * Dynamic object with linear interpolation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class DynamicObject {

    constructor(props) {
        for (let key in props) this[key] = props[key];

        this.lerp = (v, alpha) => {
            for (let key in props) this[key] += (v[key] - this[key]) * alpha;
            return this;
        };
    }
}

export { DynamicObject };
