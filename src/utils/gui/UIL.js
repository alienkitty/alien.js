/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../Interface.js';

export class UIL {
    static count = 0;
    static time = 0;
    static prev = 0;
    static fps = 0;
    static promise = new Promise(resolve => this.resolve = resolve);

    static async init() {
        const { Gui, Tools } = await import('../../lib/uil.module.js');

        Tools.colors.background = 'none';
        Tools.colors.backgroundOver = 'none';
        Tools.colors.inputBorder = '#202124';
        Tools.colors.inputBorderSelect = '#202124';
        Tools.colors.inputBg = '#151517';
        Tools.colors.inputOver = '#151517';
        Tools.colors.border = '#202124';
        Tools.colors.borderOver = '#5050aa';
        Tools.colors.borderSelect = '#202124';
        Tools.colors.button = '#35363a';
        Tools.colors.boolbg = '#151517';
        Tools.colors.boolon = '#f2f2f2';
        Tools.colors.select = '#35363a';
        Tools.colors.down = '#35363a';
        Tools.colors.over = '#35363a';
        Tools.colors.radius = 0;
        Tools.svgs.group = '';
        Tools.svgs.arrow = 'M 3 9 L 8 6 3 3 Z';
        Tools.svgs.arrowDown = 'M 5 9 L 8 4 2 4 Z';
        Tools.svgs.arrowUp = 'M 5 3 L 2 8 8 8 Z';
        Tools.setText(11, '#f2f2f2', '"Roboto Mono", monospace');

        this.gui = new Gui({
            css: 'top: 0; right: 0; z-index: 2000; background: #202124; letter-spacing: normal; -webkit-font-smoothing: initial;',
            w: 300,
            h: 26,
            p: 52,
            s: 0,
            center: true,
            transparent: true
        });

        this.gui.add('empty', { h: 26 });

        this.element = new Interface(this.gui.content);

        this.info = new Interface('.info');
        this.info.css({
            position: 'absolute',
            right: 10,
            fontFamily: '"Roboto Mono", monospace',
            fontSize: 11,
            lineHeight: 26,
            letterSpacing: 1,
            whiteSpace: 'nowrap',
            color: '#f2f2f2',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
        this.info.text(this.fps);
        this.element.add(this.info);

        this.resolve();
    }

    static add(...params) {
        return this.gui.add(...params);
    }

    static update() {
        if (!this.info) {
            return;
        }

        this.time = performance.now();

        if (this.time - 1000 > this.prev) {
            this.prev = this.time;
            this.fps = this.count;
            this.count = 0;
        }

        this.count++;

        this.info.text(this.fps);
    }

    static ready() {
        return this.promise;
    }

    constructor(name, materials, keys) {
        if (!Array.isArray(materials)) {
            materials = materials ? [materials] : [];
        }

        this.group = UIL.add('group', { name });

        materials.forEach(material => {
            for (const name in material.uniforms) {
                if (keys && !keys.includes(name)) {
                    continue;
                }

                const uniform = material.uniforms[name];
                const value = uniform.value;

                if (name.startsWith('t')) {
                    // TODO: Image
                } else if (value && value.isColor) {
                    this.addColor(name, uniform, 'value');
                } else if (value && value.toArray) {
                    this.addArray(name, uniform, 'value');
                } else if (typeof value === 'number') {
                    this.addSlide(name, uniform, 'value');
                }
            }
        });
    }

    addNumber(name, object, key, callback) {
        if (typeof name !== 'string') {
            callback = key;
            key = object;
            object = name;
            name = key;
        }

        const ui = this.group.add('number', {
            name,
            value: object[key],
            callback(value) {
                object[key] = value;

                if (callback) {
                    callback(value);
                }
            }
        });

        return ui;
    }

    addColor(name, object, key, callback) {
        if (typeof name !== 'string') {
            callback = key;
            key = object;
            object = name;
            name = key;
        }

        const ui = this.group.add('color', {
            name,
            value: object[key].getHex(),
            callback(value) {
                object[key].setHex(value);

                if (callback) {
                    callback(value);
                }
            }
        });

        return ui;
    }

    addArray(name, object, key, callback) {
        if (typeof name !== 'string') {
            callback = key;
            key = object;
            object = name;
            name = key;
        }

        const ui = this.group.add('number', {
            name,
            value: object[key].toArray(),
            callback(value) {
                object[key].fromArray(value);

                if (callback) {
                    callback(value);
                }
            }
        });

        return ui;
    }

    addSlide(name, object, key, min = 0, max = 1, step = 0.01, callback) {
        if (typeof name !== 'string') {
            callback = step;
            step = max;
            max = min;
            min = key;
            key = object;
            object = name;
            name = key;
        }

        if (typeof min !== 'number') {
            callback = min;
            min = 0;
            max = 1;
            step = 0.01;
        }

        const ui = this.group.add('slide', {
            name,
            min,
            max,
            step,
            value: object[key],
            callback(value) {
                object[key] = value;

                if (callback) {
                    callback(value);
                }
            }
        });

        return ui;
    }

    addList(name, list, object, key, callback) {
        if (typeof name !== 'string') {
            callback = key;
            key = object;
            object = list;
            list = name;
            name = key;
        }

        const ui = this.group.add('list', {
            name,
            list,
            callback(value) {
                object[key] = value;

                if (callback) {
                    callback(value);
                }
            }
        });

        return ui;
    }

    addBool(name, object, key, callback) {
        if (typeof name !== 'string') {
            callback = key;
            key = object;
            object = name;
            name = key;
        }

        const ui = this.group.add('bool', {
            name,
            value: object[key],
            callback(value) {
                object[key] = value;

                if (callback) {
                    callback(value);
                }
            }
        });

        return ui;
    }

    add(...params) {
        return this.group.add(...params);
    }

    open() {
        this.group.open();
    }
}
