/**
 * @author pschroen / https://ufo.ai/
 */

import { Assets } from './Assets.js';
import { Loader } from './Loader.js';

export class AssetLoader extends Loader {
    static loadAssets(assets, callback) {
        const promise = new Promise(resolve => new AssetLoader(assets, resolve));

        if (callback) {
            promise.then(callback);
        }

        return promise;
    }

    load(path, callback) {
        path = Assets.getPath(path);

        const cached = Assets.get(path);

        let promise;

        if (cached) {
            promise = Promise.resolve(cached);
        } else if (/\.(jpe?g|png|gif|svg)/.test(path)) {
            promise = Assets.loadImage(path);
        } else {
            promise = fetch(path, Assets.options).then(response => {
                if (/\.(mp3|m4a|ogg|wav|aiff?)/.test(path)) {
                    return response.arrayBuffer();
                } else if (/\.json/.test(path)) {
                    return response.json();
                } else {
                    return response.text();
                }
            });
        }

        promise.then(data => {
            Assets.add(path, data);

            this.increment();

            if (callback) {
                callback(data);
            }
        }).catch(event => {
            this.increment();

            if (callback) {
                callback(event);
            }
        });

        this.total++;
    }
}
