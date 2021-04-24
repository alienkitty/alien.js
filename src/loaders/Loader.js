/**
 * @author pschroen / https://ufo.ai/
 */

import { Events } from '../config/Events.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class Loader {
    constructor(assets = [], callback) {
        this.events = new EventEmitter();
        this.total = 0;
        this.loaded = 0;
        this.progress = 0;
        this.promise = new Promise(resolve => this.resolve = resolve);
        this.assets = assets;
        this.callback = callback;

        assets.forEach(path => this.load(path));
    }

    load(/* path, callback */) {}

    loadAsync(path) {
        return new Promise(resolve => this.load(path, resolve));
    }

    increment() {
        this.progress = ++this.loaded / this.total;

        this.events.emit(Events.PROGRESS, { progress: this.progress });

        if (this.loaded === this.total) {
            this.complete();
        }
    }

    complete() {
        this.resolve();

        this.events.emit(Events.COMPLETE);

        if (this.callback) {
            this.callback();
        }
    }

    add(num = 1) {
        this.total += num;
    }

    trigger(num = 1) {
        for (let i = 0; i < num; i++) {
            this.increment();
        }
    }

    ready() {
        return this.total ? this.promise : Promise.resolve();
    }

    destroy() {
        this.events.destroy();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
