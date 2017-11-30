/**
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events';
import { Interface } from '../util/Interface';

class Stage extends Interface {

    constructor() {
        super('Stage');
        const self = this;
        let last;

        initHTML();
        addListeners();

        function initHTML() {
            self.css({ overflow: 'hidden' });
        }

        function addListeners() {
            window.addEventListener('focus', () => {
                if (last !== 'focus') {
                    last = 'focus';
                    self.events.fire(Events.VISIBILITY, { type: 'focus' });
                }
            }, true);
            window.addEventListener('blur', () => {
                if (last !== 'blur') {
                    last = 'blur';
                    self.events.fire(Events.VISIBILITY, { type: 'blur' });
                }
            }, true);
            window.addEventListener('keydown', () => self.events.fire(Events.KEYBOARD_DOWN), true);
            window.addEventListener('keyup', () => self.events.fire(Events.KEYBOARD_UP), true);
            window.addEventListener('keypress', () => self.events.fire(Events.KEYBOARD_PRESS), true);
            window.addEventListener('resize', () => self.events.fire(Events.RESIZE), true);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.size();
            self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
    }
}

export { Stage };
