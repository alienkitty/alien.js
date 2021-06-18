/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://gist.github.com/jesperlandberg/66484c7bb456661662f57361851bfc31
 */

import { Component } from '../Component.js';

export class Magnetic extends Component {
    constructor(object, {
        threshold = 50
    } = {}) {
        super();

        this.object = object;
        this.threshold = threshold;
        this.hoveredIn = false;

        this.initHTML();

        this.enable();
    }

    initHTML() {
        this.object.css({ willChange: 'transform' });
    }

    addListeners() {
        window.addEventListener('pointermove', this.onUpdate);
    }

    removeListeners() {
        window.removeEventListener('pointermove', this.onUpdate);
    }

    /**
     * Event handlers
     */

    onUpdate = ({ clientX, clientY }) => {
        const bounds = this.object.element.getBoundingClientRect();
        const x = clientX - (bounds.left + bounds.width / 2);
        const y = clientY - (bounds.top + bounds.height / 2);
        const distance = Math.sqrt(x * x + y * y);

        if (distance < (bounds.width + bounds.height) / 2 + this.threshold) {
            this.object.tween({
                x: x * 0.8,
                y: y * 0.8,
                skewX: x * 0.125,
                skewY: 0,
                rotation: x * 0.05,
                scale: 1.1
            }, 500, 'easeOutCubic');

            this.hoveredIn = true;
        } else if (this.hoveredIn) {
            this.object.tween({
                x: 0,
                y: 0,
                skewX: 0,
                skewY: 0,
                rotation: 0,
                scale: 1,
                spring: 1.2,
                damping: 0.4
            }, 1000, 'easeOutElastic');

            this.hoveredIn = false;
        }
    };

    /**
     * Public methods
     */

    enable = () => {
        this.addListeners();
    };

    disable = () => {
        this.removeListeners();
    };

    destroy = () => {
        this.disable();

        return super.destroy();
    };
}
