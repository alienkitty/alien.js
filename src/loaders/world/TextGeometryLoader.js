/**
 * @author pschroen / https://ufo.ai/
 */

import { BufferAttribute, BufferGeometry } from 'three';

import { Thread } from '../../utils/Thread.js';
import { TextGeometry } from '../../utils/world/TextGeometry.js';
import { TextGeometryLoaderThread } from './TextGeometryLoaderThread.js';
import { Assets } from '../Assets.js';
import { Loader } from '../Loader.js';

export class TextGeometryLoader extends Loader {
    constructor() {
        super();

        this.defaultOptions = {
        };

        this.options = this.defaultOptions;
    }

    load(path, callback) {
        let promise;

        if (Thread.threads) {
            promise = TextGeometryLoaderThread.load(path, Assets.options, this.options);
        } else {
            promise = fetch(path, Assets.options).then(response => {
                return response.json();
            }).then(font => {
                this.options.font = font;

                const { buffers, numLines, width, height } = new TextGeometry(this.options);

                return { buffers, numLines, width, height };
            });
        }

        promise.then(text => {
            if (text.error) {
                throw new Error(text.error);
            }

            const geometry = new BufferGeometry();
            geometry.setAttribute('position', new BufferAttribute(text.buffers.position, 3));
            geometry.setAttribute('uv', new BufferAttribute(text.buffers.uv, 2));
            geometry.setAttribute('id', new BufferAttribute(text.buffers.id, 1));
            geometry.setIndex(new BufferAttribute(text.buffers.index, 1));

            this.increment();

            if (callback) {
                callback({ text, geometry });
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
