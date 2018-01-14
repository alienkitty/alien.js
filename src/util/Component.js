/**
 * Alien component.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Render } from './Render';
import { Timer } from './Timer';
import { Utils } from './Utils';

class Component {

    constructor() {
        this.events = new Events();
        this.classes = [];
        this.timers = [];
        this.loops = [];
    }

    initClass(object, ...params) {
        const child = new object(...params);
        this.add(child);
        return child;
    }

    add(child) {
        if (child.destroy) {
            this.classes.push(child);
            child.parent = this;
        }
        return this;
    }

    delayedCall(callback, time = 0, ...params) {
        const timer = Timer.create(() => {
            if (callback) callback(...params);
        }, time);
        this.timers.push(timer);
        if (this.timers.length > 50) this.timers.shift();
        return timer;
    }

    clearTimers() {
        for (let i = this.timers.length - 1; i >= 0; i--) Timer.clearTimeout(this.timers[i]);
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
        this.removed = true;
        const parent = this.parent;
        if (parent && !parent.removed && parent.remove) parent.remove(this);
        for (let i = this.classes.length - 1; i >= 0; i--) {
            const child = this.classes[i];
            if (child && child.destroy) child.destroy();
        }
        this.classes.length = 0;
        this.clearRenders();
        this.clearTimers();
        this.events.destroy();
        return Utils.nullObject(this);
    }

    remove(child) {
        this.classes.remove(child);
    }
}

export { Component };
