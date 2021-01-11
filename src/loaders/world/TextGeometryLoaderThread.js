/**
 * @author pschroen / https://ufo.ai/
 */

import { Thread } from '../../utils/Thread.js';
import { TextGeometry } from '../../utils/world/TextGeometry.js';
import { Assets } from '../Assets.js';

import { absolute } from '../../utils/Utils.js';

export class TextGeometryLoaderThread {
    static init() {
        Thread.upload(loadGeometry);

        function loadGeometry({ path, init, params, id }) {
            fetch(path, init).then(response => {
                return response.json();
            }).then(font => {
                params.font = font;

                const { buffers, numLines, width, height } = new TextGeometry(params);

                postMessage({ id, message: { buffers, numLines, width, height } });
            }).catch(error => {
                if (error instanceof Error) {
                    error = error.name + ': ' + error.message;
                }

                postMessage({ id, message: { error } });
            });
        }
    }

    static load(path, init, params) {
        path = absolute(Assets.getPath(path));

        return Thread.shared().loadGeometry({ path, init, params });
    }
}
