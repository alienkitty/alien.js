/**
 * @author pschroen / https://ufo.ai/
 */

import { Loader } from './Loader.js';

export class FontLoader extends Loader {
    constructor(assets, callback) {
        super(assets, callback);

        if (typeof assets === 'undefined') {
            this.load();
        }
    }

    load(font, callback) {
        if (typeof font === 'undefined') {
            document.fonts.ready.then(fonts => {
                this.increment();

                if (callback) {
                    callback(fonts);
                }
            }).catch(event => {
                this.increment();

                if (callback) {
                    callback(event);
                }
            });
        } else {
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
        }

        this.total++;
    }
}
