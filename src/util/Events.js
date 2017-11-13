/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils';

class Events {

    constructor() {
        let events = [];

        this.add = (event, callback) => {
            events.push({ event, callback });
        };

        this.remove = (event, callback) => {
            for (let i = events.length - 1; i > -1; i--) {
                if (events[i].event === event && events[i].callback === callback) {
                    events[i] = null;
                    events.splice(i, 1);
                    break;
                }
            }
        };

        this.destroy = () => {
            for (let i = events.length - 1; i > -1; i--) {
                events[i] = null;
                events.splice(i, 1);
            }
            return null;
        };

        this.fire = (event, object = {}) => {
            let clone = Utils.cloneArray(events);
            for (let i = 0; i < clone.length; i++) if (clone[i].event === event) clone[i].callback(object);
        };
    }
}

(() => {
    Events.BROWSER_FOCUS  = 'browser_focus';
    Events.KEYBOARD_PRESS = 'keyboard_press';
    Events.KEYBOARD_DOWN  = 'keyboard_down';
    Events.KEYBOARD_UP    = 'keyboard_up';
    Events.RESIZE         = 'resize';
    Events.COMPLETE       = 'complete';
    Events.PROGRESS       = 'progress';
    Events.UPDATE         = 'update';
    Events.LOADED         = 'loaded';
    Events.ERROR          = 'error';
    Events.READY          = 'ready';
    Events.HOVER          = 'hover';
    Events.CLICK          = 'click';
})();

window.events = new Events();

export { Events };
