/**
 * @author pschroen / https://ufo.ai/
 */

import { absolute, getConstructorName, guid } from './Utils.js';

import { Assets } from '../loaders/Assets.js';
import { EventEmitter } from './EventEmitter.js';
import { Cluster } from './Cluster.js';

const THREAD = /* js */`
var selfRef = self;

self.addEventListener('message', ({ data }) => {
    if (data.message && data.message.fn) {
        self[data.message.fn](data.message);
    } else if (data.code) {
        self.eval(data.code);
    } else if (data.importScript) {
        importScripts(data.path);
    }
});
`;

export class Thread extends EventEmitter {
    static count = navigator.hardwareConcurrency || 4;

    static shared(list) {
        if (!this.threads) {
            this.threads = new Cluster(Thread, this.count);
        }

        return !list ? this.threads.get() : this.threads;
    }

    static upload(object) {
        const threads = this.shared(true);

        for (let i = 0, l = threads.array.length; i < l; i++) {
            threads.array[i].loadFunction(object);
        }
    }

    constructor() {
        super();

        this.worker = new Worker(URL.createObjectURL(new Blob([THREAD], { type: 'text/javascript' })));

        this.addListeners();
    }

    addListeners() {
        this.worker.addEventListener('message', ({ data }) => {
            if (data.event) {
                this.emit(data.event, data.message);
            } else if (data.id) {
                this.emit(data.id, data.message);
                this.off(data.id);
            }
        });
    }

    createMethod(name) {
        this[name] = (message = {}, callback) => {
            const promise = new Promise(resolve => this.send(name, message, resolve));

            if (callback) {
                promise.then(callback);
            }

            return promise;
        };
    }

    importScript(path) {
        path = absolute(Assets.getPath(path));

        this.worker.postMessage({ importScript: true, path });
    }

    importClasses(...objects) {
        objects.forEach(object => this.importClass(object));
    }

    importClass(object) {
        const code = object.toString();

        this.worker.postMessage({ code });
    }

    loadFunctions(...objects) {
        objects.forEach(object => this.loadFunction(object));
    }

    loadFunction(object) {
        let code = object.toString();
        const name = getConstructorName(object);

        code = `self.${name}=${code};`;

        this.createMethod(name);

        this.worker.postMessage({ code });
    }

    send(name, message = {}, callback) {
        const id = guid();

        message.id = id;
        message.fn = name;

        if (callback) {
            this.on(id, callback);
        }

        this.worker.postMessage({ message }, message.buffer);
    }
}
