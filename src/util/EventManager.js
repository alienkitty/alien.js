/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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

        this.add = (event, callback) => {
            events.push({event, callback});
        };

        this.remove = (eventString, callback) => {
            for (let i = events.length - 1; i > -1; i--) if (events[i].event === eventString && events[i].callback === callback) events.splice(i, 1);
        };

        this.fire = (eventString, object = {}) => {
            for (let i = 0; i < events.length; i++) if (events[i].event === eventString) events[i].callback(object);
        };
    }
}

if (!window.events) window.events = new EventManager();

export { EventManager };
