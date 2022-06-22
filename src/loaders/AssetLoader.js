/**
 * @author pschroen / https://ufo.ai/
 */

import { Assets } from './Assets.js';
import { Loader } from './Loader.js';

export class AssetLoader extends Loader {
    load(path, callback) {
        const cached = Assets.get(path);

        let promise;

        if (cached) {
            promise = Promise.resolve(cached);
        } else if (/\.(jpe?g|png|gif|svg)/.test(path)) {
            promise = Assets.loadImage(path);
        } else if (/\.json/.test(path)) {
            promise = Assets.loadData(path);
        } else {
            promise = fetch(Assets.getPath(path), Assets.options).then(response => {
                if (/\.(mp3|m4a|ogg|wav|aiff?)/.test(path)) {
                    return response.arrayBuffer();
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
