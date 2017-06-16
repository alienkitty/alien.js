/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { EventManager } from './EventManager';
import { Stage } from '../view/Stage';

class FontLoader {

    constructor(fonts, callback) {
        let self = this;
        this.events = new EventManager();
        let element;

        initFonts();
        finish();

        function initFonts() {
            if (!Array.isArray(fonts)) fonts = [fonts];
            element = Stage.create('FontLoader');
            for (let i = 0; i < fonts.length; i++) element.create('font').fontStyle(fonts[i], 12, '#000').text('LOAD').css({top:-999});
        }

        function finish() {
            Delayed(() => {
                element.destroy();
                self.complete = true;
                self.events.fire(Events.COMPLETE);
                if (callback) callback();
            }, 500);
        }
    }
}

FontLoader.loadFonts = (fonts, callback) => {
    let promise = Promise.create();
    if (!callback) callback = promise.resolve;
    new FontLoader(fonts, callback);
    return promise;
};

export { FontLoader };
