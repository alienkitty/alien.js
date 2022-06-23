/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/lo-th/uil
 */

import { Vector2 } from 'three/src/math/Vector2.js';

import { Events } from '../../config/Events.js';
import { Interface } from '../Interface.js';

import { clamp } from '../Utils.js';

export class Slider extends Interface {
    constructor({
        label = '',
        min = 0,
        max = 1,
        step = 0.01,
        value = 0,
        callback,
        styles
    }) {
        super('.slider');

        this.label = label;
        this.min = min;
        this.max = max;
        this.step = step;
        this.precision = this.getPrecision(this.step);
        this.value = typeof value === 'string' ? parseFloat(value) : value;
        this.callback = callback;
        this.styles = styles;

        this.range = this.max - this.min;
        this.value = this.getValue(this.value);
        this.lastValue = this.value;

        this.origin = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.firstDown = false;
        this.lastMouse = new Vector2();
        this.lastOrigin = new Vector2();

        this.initHTML();

        this.addListeners();
        this.update();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: '100%',
            height: 28,
            cursor: 'w-resize'
        });

        this.text = new Interface('.text');
        this.text.css({
            position: 'relative',
            cssFloat: 'left',
            marginRight: 10,
            textTransform: 'uppercase',
            ...this.styles.panel,
            lineHeight: 20,
            whiteSpace: 'nowrap'
        });
        this.text.text(this.label);
        this.add(this.text);

        this.number = new Interface('.number');
        this.number.css({
            position: 'relative',
            cssFloat: 'right',
            ...this.styles.number,
            lineHeight: 20,
            letterSpacing: 0.5,
            whiteSpace: 'nowrap'
        });
        this.add(this.number);

        this.line = new Interface('.line');
        this.line.css({
            position: 'relative',
            clear: 'both',
            width: '100%',
            height: 1,
            backgroundColor: 'var(--ui-color)',
            transformOrigin: 'left center'
        });
        this.add(this.line);
    }

    addListeners() {
        this.element.addEventListener('pointerdown', this.onPointerDown);
    }

    removeListeners() {
        this.element.removeEventListener('pointerdown', this.onPointerDown);
    }

    getPrecision(value) {
        const str = String(value);
        const delimiter = str.indexOf('.') + 1;

        return !delimiter ? 0 : str.length - delimiter;
    }

    getValue(value) {
        return parseFloat(clamp(value, this.min, this.max).toFixed(this.precision));
    }

    /**
     * Event handlers
     */

    onPointerDown = e => {
        this.firstDown = true;

        this.onPointerMove(e);

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    };

    onPointerMove = ({ clientX, clientY }) => {
        const bounds = this.element.getBoundingClientRect();

        const event = {
            x: clientX,
            y: clientY
        };

        this.mouse.copy(event);

        if (this.firstDown) {
            this.firstDown = false;
            this.lastMouse.copy(event);
            this.lastOrigin.subVectors(event, bounds);
            this.lastValue = this.value;
        }

        this.delta.subVectors(this.mouse, this.lastMouse);
        this.origin.addVectors(this.lastOrigin, this.delta);

        let value = ((this.origin.x / bounds.width) * this.range + this.min) - this.lastValue;
        value = Math.floor(value / this.step);
        this.value = this.getValue(this.lastValue + value * this.step);

        this.update();
    };

    onPointerUp = e => {
        window.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('pointermove', this.onPointerMove);

        this.onPointerMove(e);
    };

    /**
     * Public methods
     */

    setValue = value => {
        this.value = typeof value === 'string' ? parseFloat(value) : value;
        this.value = this.getValue(this.value);
        this.lastValue = this.value;

        this.update();

        return this;
    };

    update = () => {
        const scaleX = (this.value - this.min) / this.range;

        this.line.css({ scaleX });
        this.number.text(this.value);

        if (this.value !== this.lastValue) {
            this.lastValue = this.value;

            this.events.emit(Events.UPDATE, this.value);

            if (this.callback) {
                this.callback(this.value);
            }
        }
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
