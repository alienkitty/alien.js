/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils';

window.Events = {
    BROWSER_FOCUS:  'browser_focus',
    KEYBOARD_PRESS: 'keyboard_press',
    KEYBOARD_DOWN:  'keyboard_down',
    KEYBOARD_UP:    'keyboard_up',
    RESIZE:         'resize',
    COMPLETE:       'complete',
    PROGRESS:       'progress',
    UPDATE:         'update',
    LOADED:         'loaded',
    ERROR:          'error',
    READY:          'ready',
    HOVER:          'hover',
    CLICK:          'click'
};

class EventManager {

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

window.events = new EventManager();

export { EventManager };
