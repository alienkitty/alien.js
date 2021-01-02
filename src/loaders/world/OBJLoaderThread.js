/**
 * @author pschroen / https://ufo.ai/
 */

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { Thread } from '../../utils/Thread.js';
import { Assets } from '../Assets.js';

import { absolute } from '../../utils/Utils.js';

export class OBJLoaderThread {
    static init() {
        Thread.upload(loadGeometry);

        function loadGeometry({ path, id }) {
            const loader = new OBJLoader();
            loader.load(
                path,
                object => {
                    const vertices = object.children[0].geometry.getAttribute('position').array;

                    postMessage({ id, message: vertices });
                },
                null,
                error => {
                    if (error instanceof Error) {
                        error = error.name + ': ' + error.message;
                    } else if (error instanceof ProgressEvent) {
                        error = error.target.status + ': ' + error.target.statusText;
                    }

                    postMessage({ id, message: { error } });
                }
            );
        }
    }

    static load(path) {
        path = absolute(Assets.getPath(path));

        return Thread.shared().loadGeometry({ path });
    }
}
