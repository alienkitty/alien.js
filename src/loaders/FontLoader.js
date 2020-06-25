/**
 * @author pschroen / https://ufo.ai/
 */

import { Loader } from './Loader.js';

export class FontLoader extends Loader {
    static loadFonts(fonts, callback) {
        const promise = new Promise(resolve => new FontLoader(fonts, resolve));

        if (callback) {
            promise.then(callback);
        }

        return promise;
    }

    load(font, callback) {
        if (typeof font !== 'object') {
            font = {
                style: 'normal',
                variant: 'normal',
                weight: 'normal',
                family: font.replace(/"/g, '\'')
            };
        }

        const specifier = (({ style = 'normal', variant = 'normal', weight = 'normal', family }) => {
            return `${style} ${variant} ${weight} 12px "${family}"`;
        })(font);

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        document.fonts.load(specifier).then(list => {
            context.font = specifier;
            context.fillText('LOAD', 0, 0);

            return list;
        }).then(list => {
            this.increment();

            if (callback) {
                callback(list);
            }
        }).catch(event => {
            this.increment();

            if (callback) {
                callback(event);
            }
        }).finally(() => {
            context = null;
            canvas = null;
        });

        this.total++;
    }
}
