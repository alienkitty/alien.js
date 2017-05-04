/**
 * Dynamic object with linear interpolation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class DynamicObject {

    constructor(props) {
        for (let key in props) this[key] = props[key];

        this.lerp = (v, ratio) => {
            for (let key in props) this[key] += (v[key] - this[key]) * ratio;
            return this;
        };
    }
}

export { DynamicObject };
