/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils';

if (!window.Events) window.Events = {
    BROWSER_FOCUS:  'browser_focus',
    KEYBOARD_DOWN:  'keyboard_down',
    KEYBOARD_UP:    'keyboard_up',
    KEYBOARD_PRESS: 'keyboard_press',
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

        this.add = (event, callback, object) => {
            events.push({event, callback, object});
        };

        this.remove = (eventString, callback) => {
            for (let i = events.length - 1; i > -1; i--) {
                if (events[i].event === eventString && events[i].callback === callback) {
                    events[i] = null;
                    events.splice(i, 1);
                }
            }
        };

        this.destroy = object => {
            if (object) {
                for (let i = events.length - 1; i > -1; i--) {
                    if (events[i].object === object) {
                        events[i] = null;
                        events.splice(i, 1);
                    }
                }
            } else {
                window.events.destroy(this);
                for (let i = events.length - 1; i > -1; i--) {
                    events[i] = null;
                    events.splice(i, 1);
                }
                return null;
            }
        };

        this.fire = (eventString, object = {}) => {
            let clone = Utils.cloneArray(events);
            for (let i = 0; i < clone.length; i++) if (clone[i].event === event) clone[i].callback(object);
        };

        this.subscribe = (event, callback) => {
            window.events.add(event, callback, this);
            return callback;
        };

        this.unsubscribe = (event, callback) => {
            window.events.remove(event, callback, this);
        };
    }
}

if (!window.events) window.events = new EventManager();

export { EventManager };
