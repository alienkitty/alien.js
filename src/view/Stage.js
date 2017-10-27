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
                    self.events.fire(Events.BROWSER_FOCUS, {type:'focus'});
                }
            });
            window.addEventListener('blur', () => {
                if (last !== 'blur') {
                    last = 'blur';
                    window.events.fire(Events.BROWSER_FOCUS, {type:'blur'});
                    self.events.fire(Events.BROWSER_FOCUS, {type:'blur'});
                }
            });
            window.addEventListener('keydown', () => self.events.fire(Events.KEYBOARD_DOWN));
            window.addEventListener('keyup', () => self.events.fire(Events.KEYBOARD_UP));
            window.addEventListener('keypress', () => self.events.fire(Events.KEYBOARD_PRESS));
            window.addEventListener('resize', () => self.events.fire(Events.RESIZE));
            self.events.add(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            self.size();
            self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
    }
}

export { Stage };
