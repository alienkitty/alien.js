/**
 * Object pool.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils';

class ObjectPool {

    constructor(type, number) {
        const pool = [];
        this.array = pool;

        if (type) for (let i = 0; i < number || 10; i++) pool.push(new type());

        this.get = () => {
            return pool.shift() || (type ? new type() : null);
        };

        this.empty = () => {
            pool.length = 0;
        };

        this.put = object => {
            pool.push(object);
        };

        this.insert = array => {
            if (!Array.isArray(array)) array = [array];
            pool.push(...array);
        };

        this.length = () => {
            return pool.length;
        };

        this.destroy = () => {
            for (let i = pool.length - 1; i >= 0; i--) if (pool[i].destroy) pool[i].destroy();
            return Utils.nullObject(this);
        };
    }
}

export { ObjectPool };
