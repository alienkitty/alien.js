/**
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from '../util/Interface';
import { Device } from '../util/Device';

let Stage = new ( // Singleton pattern

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
            });
            window.addEventListener('blur', () => {
                if (last !== 'blur') {
                    last = 'blur';
                    window.events.fire(Events.BROWSER_FOCUS, {type:'blur'});
                }
            });
            window.addEventListener('keydown', () => window.events.fire(Events.KEYBOARD_DOWN));
            window.addEventListener('keyup', () => window.events.fire(Events.KEYBOARD_UP));
            window.addEventListener('keypress', () => window.events.fire(Events.KEYBOARD_PRESS));
            window.addEventListener('resize', () => window.events.fire(Events.RESIZE));
            self.events.subscribe(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            self.size();
            if (Device.mobile) {
                self.tablet = (() => {
                    if (window.innerWidth > window.innerHeight) return document.body.clientWidth > 800;
                    else return document.body.clientHeight > 800;
                })();
                self.phone = !self.tablet;
                self.type = self.phone ? 'phone' : 'tablet';
                self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            }
        }
    }
}

)(); // Singleton pattern

export { Stage };
