/**
 * @author pschroen / https://ufo.ai/
 */

import { clearTween, delayedCall, tween } from './Tween.js';

import { EventEmitter } from './EventEmitter.js';

export class Component {
    constructor() {
        this.events = new EventEmitter();
        this.children = [];
        this.timeouts = [];
    }

    add(child) {
        if (child.destroy) {
            this.children.push(child);

            child.parent = this;
        }

        if (child.group && this.group && this.group.add) {
            this.group.add(child.group);
        }

        return child;
    }

    remove(child) {
        if (child.group && this.group && this.group.remove) {
            this.group.remove(child.group);
        }

        const index = this.children.indexOf(child);

        if (~index) {
            this.children.splice(index, 1);
        }
    }

    tween(props, time, ease, delay, complete, update) {
        return tween(this, props, time, ease, delay, complete, update);
    }

    clearTween() {
        clearTween(this);

        return this;
    }

    delayedCall(time, callback, ...params) {
        const timeout = delayedCall(time, () => {
            this.clearTimeout(timeout);

            callback(...params);
        });

        this.timeouts.push(timeout);

        return timeout;
    }

    clearTimeout(callback) {
        clearTween(callback);

        const index = this.timeouts.indexOf(callback);

        if (~index) {
            this.timeouts.splice(index, 1);
        }
    }

    clearTimeouts() {
        for (let i = this.timeouts.length - 1; i >= 0; i--) {
            this.clearTimeout(this.timeouts[i]);
        }

        this.timeouts.length = 0;
    }

    destroy() {
        if (this.parent && this.parent.remove) {
            this.parent.remove(this);
        }

        this.clearTimeouts();
        this.clearTween();

        this.events.destroy();

        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i] && this.children[i].destroy) {
                this.children[i].destroy();
            }
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
