/**
 * @author pschroen / https://ufo.ai/
 */

import { Assets } from '../loaders/Assets.js';
import { EventEmitter } from './EventEmitter.js';
import { Cluster } from './Cluster.js';

import { absolute, getConstructorName, guid } from './Utils.js';

export class Thread extends EventEmitter {
    static count = navigator.hardwareConcurrency || 4;
    static params = {};

    static shared(params) {
        if (!this.threads) {
            this.params = params || {};
            this.params.chunks = this.chunks;
            this.threads = new Cluster(Thread, this.count);
        }

        return !params ? this.threads.get() : this.threads;
    }

    static upload(...objects) {
        if (!this.chunks) {
            this.chunks = [];
        }

        objects.forEach(object => this.chunks.push(getConstructorName(object), object));
    }

    constructor({
        imports = [],
        classes = [],
        controller = [],
        chunks = []
    } = Thread.params) {
        super();

        const code = [];

        imports.forEach(bundle => {
            const [path, ...named] = bundle;

            code.push(`import { ${named.join(', ')} } from '${absolute(Assets.getPath(path))}';`);
        });

        if (classes.length) {
            code.push(classes.map(object => object.toString()).join('\n\n'));
        }

        if (controller.length) {
            controller.forEach(object => {
                if (typeof object === 'string') {
                    this.createMethod(object);
                } else {
                    code.push(`${object.toString()}\n\nnew ${getConstructorName(object)}();`);
                }
            });
        } else {
            code.push('addEventListener(\'message\', ({ data }) => self[data.message.fn].call(self, data.message));');

            chunks.forEach(object => {
                if (typeof object === 'string') {
                    this.createMethod(object);
                } else {
                    code.push(`self.${getConstructorName(object)}=${object.toString()};`);
                }
            });
        }

        this.worker = new Worker(URL.createObjectURL(new Blob([code.join('\n\n')], { type: 'text/javascript' })), { type: 'module' });

        this.addListeners();
    }

    addListeners() {
        this.worker.addEventListener('message', this.onMessage);
    }

    removeListeners() {
        this.worker.removeEventListener('message', this.onMessage);
    }

    onMessage = ({ data }) => {
        if (data.event) {
            this.emit(data.event, data.message);
        } else if (data.id) {
            this.emit(data.id, data.message);
            this.off(data.id);
        }
    };

    createMethod(name) {
        this[name] = (message = {}, callback) => {
            const promise = new Promise(resolve => this.send(name, message, resolve));

            if (callback) {
                promise.then(callback);
            }

            return promise;
        };
    }

    send(name, message = {}, callback) {
        message.fn = name;

        if (callback) {
            const id = guid();

            message.id = id;

            this.on(id, callback);
        }

        this.worker.postMessage({ message }, message.buffer);
    }

    destroy() {
        this.removeListeners();

        this.worker.terminate();

        return super.destroy();
    }
}
