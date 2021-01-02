/**
 * @author pschroen / https://ufo.ai/
 */

import { Thread } from '../utils/Thread.js';
import { ImageBitmapLoaderThread } from './ImageBitmapLoaderThread.js';
import { Assets } from './Assets.js';
import { Loader } from './Loader.js';

export class ImageBitmapLoader extends Loader {
    constructor(assets, callback) {
        super(assets, callback);

        this.defaultOptions = {
            imageOrientation: 'none'
        };

        this.options = this.defaultOptions;
    }

    load(path, callback) {
        path = Assets.getPath(path);

        const cached = Assets.get(path);

        let promise;

        if (cached) {
            promise = Promise.resolve(cached);
        } else if (Thread.threads) {
            promise = ImageBitmapLoaderThread.load(path, Assets.options, this.options);
        } else {
            promise = fetch(path, Assets.options).then(response => {
                return response.blob();
            }).then(blob => {
                return createImageBitmap(blob, this.options);
            });
        }

        promise.then(bitmap => {
            if (bitmap.error) {
                throw new Error(bitmap.error);
            }

            Assets.add(path, bitmap);

            this.increment();

            if (callback) {
                callback(bitmap);
            }
        }).catch(event => {
            this.increment();

            if (callback) {
                callback(event);
            }
        });

        this.total++;
    }

    setOptions(options) {
        this.options = Object.assign(this.defaultOptions, options);

        return this;
    }
}
