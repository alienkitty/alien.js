/**
 * Object pool.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils';

class ObjectPool {

    constructor(type, number) {
        let pool = [];
        this.array = pool;

        if (type) {
            number = number || 10;
            for (let i = 0; i < number; i++) pool.push(new type());
        }

        this.get = () => {
            return pool.shift() || (type ? new type() : null);
        };

        this.empty = () => {
            pool.length = 0;
        };

        this.put = object => {
            if (object) pool.push(object);
        };

        this.insert = array => {
            if (typeof array.push === 'undefined') array = [array];
            for (let i = 0; i < array.length; i++) pool.push(array[i]);
        };

        this.length = () => {
            return pool.length;
        };

        this.destroy = () => {
            for (let i = 0; i < pool.length; i++) if (pool[i].destroy) pool[i].destroy();
            pool = null;
            return Utils.nullObject(this);
        };
    }
}

export { ObjectPool };
