/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../Interface.js';
import { Stage } from '../Stage.js';

export class Panel extends Interface {
    constructor() {
        super('.panel');

        this.items = [];
        this.animatedIn = false;
        this.openColor = null;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.hide();
        this.css({
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }

    addListeners() {
        Stage.events.on('color_picker', this.onColorPicker);
    }

    removeListeners() {
        Stage.events.off('color_picker', this.onColorPicker);
    }

    /**
     * Event handlers
     */

    onColorPicker = ({ open, target }) => {
        if (!this.openColor && !this.element.contains(target.element)) {
            return;
        }

        if (open) {
            this.items.forEach(item => {
                item.clearTween();

                if (item.color && item.color.isOpen) {
                    item.color.fastClose = true;
                    return;
                }

                item.css({ pointerEvents: 'none' });
                item.tween({ opacity: 0.35 }, 500, 'easeInOutSine');
            });

            this.openColor = target;
        } else {
            this.items.forEach(item => {
                item.clearTween();
                item.tween({ opacity: 1 }, 500, 'easeInOutSine', () => {
                    item.css({ pointerEvents: 'auto' });
                });
            });

            this.openColor = null;
        }
    };

    /**
     * Public methods
     */

    add = child => {
        super.add(child);

        this.items.push(child);
    };

    animateIn = fast => {
        this.show();

        this.items.forEach((item, i) => item.animateIn(i * 15, fast));

        this.animatedIn = true;
    };

    animateOut = callback => {
        if (!this.animatedIn) {
            return;
        }

        this.animatedIn = false;

        this.items.forEach((item, i) => {
            item.animateOut(i, this.items.length - 1, (this.items.length - 1 - i) * 15, () => {
                this.hide();

                if (callback) {
                    callback();
                }
            });
        });
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
