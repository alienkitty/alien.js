/**
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from '../util/Interface';

class Stage extends Interface {

    constructor() {
        super('Stage');
        let self = this;
        let last;

        initHTML();
        addListeners();
        resizeHandler();

        function initHTML() {
            self.css({overflow:'hidden'});
        }

        function addListeners() {
            window.addEventListener('focus', () => {
                if (last !== 'focus') {
                    last = 'focus';
                    window.events.fire(Events.BROWSER_FOCUS, {type:'focus'});
                }
            }, false);
            window.addEventListener('blur', () => {
                if (last !== 'blur') {
                    last = 'blur';
                    window.events.fire(Events.BROWSER_FOCUS, {type:'blur'});
                }
            }, false);
            window.addEventListener('resize', () => {
                window.events.fire(Events.RESIZE);
            }, false);
            window.events.add(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            self.size();
        }
    }
}

export { Stage };
