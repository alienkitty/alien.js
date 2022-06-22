/**
 * @author pschroen / https://ufo.ai/
 */

import { Loader } from './Loader.js';

export class FontLoader extends Loader {
    constructor() {
        super();

        this.load();
    }

    load() {
        document.fonts.ready.then(() => {
            this.increment();
        }).catch(() => {
            this.increment();
        });

        this.total++;
    }
}
