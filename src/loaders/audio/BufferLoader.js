/**
 * @author pschroen / https://ufo.ai/
 */

import { Assets } from '../Assets.js';
import { Loader } from '../Loader.js';

export class BufferLoader extends Loader {
    constructor(context, assets, callback) {
        super(assets, callback);

        this.context = context;
    }

    load(path, callback) {
        const cached = Assets.get(path);

        let promise;

        if (cached) {
            promise = Promise.resolve(cached);
        } else {
            promise = fetch(Assets.getPath(path), Assets.options).then(response => {
                return response.arrayBuffer();
            }).then(buffer => {
                return this.context.decodeAudioData(buffer);
            });
        }

        promise.then(buffer => {
            Assets.add(path, buffer);

            this.increment();

            if (callback) {
                callback(buffer);
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
