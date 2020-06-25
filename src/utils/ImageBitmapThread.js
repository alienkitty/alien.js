/**
 * @author pschroen / https://ufo.ai/
 */

import { absolute } from './Utils.js';

import { Assets } from '../loaders/Assets.js';
import { Thread } from './Thread.js';

export class ImageBitmapThread {
    static init() {
        Thread.upload(loadImage);

        function loadImage({ path, init, params, id }) {
            fetch(path, init).then(response => {
                return response.blob();
            }).then(blob => {
                return createImageBitmap(blob, params);
            }).then(bitmap => {
                postMessage({ id, message: bitmap }, [bitmap]);
            }).catch(event => {
                postMessage({ id, message: { error: event } });
            });
        }
    }

    static load(path, init, params) {
        path = absolute(Assets.getPath(path));

        return Thread.shared().loadImage({ path, init, params });
    }
}
