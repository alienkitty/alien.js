/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Stage } from '../view/Stage';

class FontLoader {

    constructor(fonts, callback) {
        const self = this;
        this.events = new Events();
        let element;

        initFonts();
        finish();

        function initFonts() {
            if (!Array.isArray(fonts)) fonts = [fonts];
            element = Stage.create('FontLoader');
            for (let i = 0; i < fonts.length; i++) element.create('font').fontStyle(fonts[i], 12, '#000').text('LOAD').css({ top: -999 });
        }

        function finish() {
            setTimeout(() => {
                element.destroy();
                self.complete = true;
                self.events.fire(Events.COMPLETE);
                if (callback) callback();
            }, 500);
        }
    }

    static loadFonts(fonts, callback) {
        const promise = Promise.create();
        if (!callback) callback = promise.resolve;
        promise.loader = new FontLoader(fonts, callback);
        return promise;
    }
}

export { FontLoader };
