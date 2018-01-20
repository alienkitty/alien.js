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
            window.addEventListener('focus', focus, true);
            window.addEventListener('blur', blur, true);
            window.addEventListener('keydown', e => self.events.fire(Events.KEYBOARD_DOWN, e), true);
            window.addEventListener('keyup', e => self.events.fire(Events.KEYBOARD_UP, e), true);
            window.addEventListener('keypress', e => self.events.fire(Events.KEYBOARD_PRESS, e), true);
            window.addEventListener('resize', () => self.events.fire(Events.RESIZE), true);
            window.addEventListener('orientationchange', () => Stage.events.fire(Events.RESIZE), true);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function focus() {
            if (last !== 'focus') {
                last = 'focus';
                self.events.fire(Events.VISIBILITY, { type: 'focus' });
            }
        }

        function blur() {
            if (last !== 'blur') {
                last = 'blur';
                self.events.fire(Events.VISIBILITY, { type: 'blur' });
            }
        }

        function resize() {
            self.size();
            self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
    }
}

export { Stage };
