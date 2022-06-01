/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/lo-th/uil
 */

import { Events } from '../../config/Events.js';
import { Interface } from '../Interface.js';

export class Link extends Interface {
    constructor({
        value = '',
        callback,
        styles
    }) {
        super('.link');

        this.value = value;
        this.callback = callback;
        this.styles = styles;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: 'fit-content',
            height: 20,
            textTransform: 'uppercase',
            ...this.styles.panel,
            whiteSpace: 'nowrap',
            cursor: 'pointer'
        });
        this.text(this.value);

        this.line = new Interface('.line');
        this.line.css({
            left: 0,
            right: 0,
            bottom: 1,
            height: 1,
            backgroundColor: 'var(--ui-color)',
            scaleX: 0
        });
        this.add(this.line);
    }

    addListeners() {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        this.line.clearTween();

        if (type === 'mouseenter') {
            this.line.css({ transformOrigin: 'left center', scaleX: 0 }).tween({ scaleX: 1 }, 800, 'easeOutQuint');
        } else {
            this.line.css({ transformOrigin: 'right center' }).tween({ scaleX: 0 }, 500, 'easeOutQuint');
        }
    };

    onClick = () => {
        const value = this.value;

        this.events.emit(Events.UPDATE, value);

        if (this.callback) {
            this.callback(value);
        }
    };

    /**
     * Public methods
     */

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
