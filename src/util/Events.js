/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils';

class Events {

    constructor() {
        const events = {};

        this.add = (event, callback) => {
            if (!events[event]) events[event] = [];
            events[event].push(callback);
        };

        this.remove = (event, callback) => {
            if (!events[event]) return;
            events[event].remove(callback);
        };

        this.destroy = () => {
            for (let event in events) {
                for (let i = events[event].length - 1; i > -1; i--) {
                    events[event][i] = null;
                    events[event].splice(i, 1);
                }
            }
            return Utils.nullObject(this);
        };

        this.fire = (event, object = {}) => {
            if (!events[event]) return;
            const clone = Utils.cloneArray(events[event]);
            clone.forEach(callback => callback(object));
        };
    }
}

Events.VISIBILITY     = 'visibility';
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

export { Events };
