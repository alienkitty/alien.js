/**
 * @author pschroen / https://ufo.ai/
 */

import { Thread } from '../../utils/Thread.js';
import { Assets } from '../Assets.js';

import { absolute } from '../../utils/Utils.js';

export class BufferGeometryLoaderThread {
    static init() {
        Thread.upload(loadBufferGeometry);

        function loadBufferGeometry({ path, options, id }) {
            fetch(path, options).then(response => {
                return response.json();
            }).then(({ data }) => {
                const buffers = {
                    position: new Float32Array(data.attributes.position.array),
                    normal: new Float32Array(data.attributes.normal.array),
                    uv: new Float32Array(data.attributes.uv.array)
                };

                postMessage({ id, message: buffers });
            }).catch(error => {
                if (error instanceof Error) {
                    error = error.name + ': ' + error.message;
                }

                postMessage({ id, message: { error } });
            });
        }
    }

    static load(path, options) {
        path = absolute(Assets.getPath(path));

        return Thread.shared().loadBufferGeometry({ path, options });
    }
}
