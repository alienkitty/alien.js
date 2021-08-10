/**
 * @author pschroen / https://ufo.ai/
 */

import { BufferAttribute, BufferGeometry } from 'three';

import { Thread } from '../../utils/Thread.js';
import { BufferGeometryLoaderThread } from './BufferGeometryLoaderThread.js';
import { Assets } from '../Assets.js';
import { Loader } from '../Loader.js';

export class BufferGeometryLoader extends Loader {
    load(path, callback) {
        let promise;

        if (Thread.threads) {
            promise = BufferGeometryLoaderThread.load(path, Assets.options);
        } else {
            promise = fetch(path, Assets.options).then(response => {
                return response.json();
            }).then(({ data }) => {
                const buffers = {};

                for (const key in data.attributes) {
                    buffers[key] = new Float32Array(data.attributes[key].array);
                }

                return buffers;
            });
        }

        promise.then(buffers => {
            if (buffers.error) {
                throw new Error(buffers.error);
            }

            const geometry = new BufferGeometry();
            geometry.setAttribute('position', new BufferAttribute(buffers.position, 3));
            geometry.setAttribute('normal', new BufferAttribute(buffers.normal, 3));
            geometry.setAttribute('uv', new BufferAttribute(buffers.uv, 2));

            if (buffers.uv2) {
                geometry.setAttribute('uv2', new BufferAttribute(buffers.uv2, 2));
            }

            this.increment();

            if (callback) {
                callback(geometry);
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
