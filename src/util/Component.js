/**
 * Alien component.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Render } from './Render';
import { Utils } from './Utils';

class Component {

    constructor() {
        this.events = new Events();
        this.classes = [];
        this.timers = [];
        this.loops = [];
    }

    initClass(object, ...params) {
        let child = new object(...params);
        this.add(child);
        return child;
    }

    add(child) {
        child.parent = this;
        if (child.destroy) this.classes.push(child);
    }

    delayedCall(callback, time = 0, ...params) {
        let timer = setTimeout(() => {
            if (callback) callback(...params);
        }, time);
        this.timers.push(timer);
        if (this.timers.length > 50) this.timers.shift();
        return timer;
    }

    clearTimers() {
        for (let i = this.timers.length - 1; i >= 0; i--) clearTimeout(this.timers[i]);
        this.timers.length = 0;
    }

    startRender(callback, fps) {
        this.loops.push(callback);
        Render.start(callback, fps);
    }

    stopRender(callback) {
        this.loops.remove(callback);
        Render.stop(callback);
    }

    clearRenders() {
        for (let i = this.loops.length - 1; i >= 0; i--) this.stopRender(this.loops[i]);
        this.loops.length = 0;
    }

    destroy() {
        for (let i = this.classes.length - 1; i >= 0; i--) {
            let child = this.classes[i];
            if (child && child.destroy) child.destroy();
        }
        this.classes.length = 0;
        this.clearRenders();
        this.clearTimers();
        this.events.destroy();
        this.removed = true;
        if (this.parent && this.parent.remove) this.parent.remove(this);
        return Utils.nullObject(this);
    }

    remove(child) {
        if (this.classes.remove(child) && !child.removed) child.destroy();
    }
}

export { Component };
