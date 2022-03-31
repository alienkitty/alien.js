/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../Interface.js';

export class TargetNumber extends Interface {
    constructor({
        styles
    }) {
        super('.number');

        this.styles = styles;

        const size = 17;

        this.width = size;
        this.height = size;

        this.initHTML();
    }

    initHTML() {
        this.invisible();
        this.css({
            position: 'absolute',
            boxSizing: 'border-box',
            width: this.width,
            height: this.height,
            border: '1.5px solid var(--ui-color)'
        });

        this.text = new Interface('.text');
        this.text.css({
            position: 'absolute',
            left: 4,
            ...this.styles.number,
            lineHeight: this.height - 3,
            textAlign: 'center'
        });
        this.add(this.text);
    }

    /**
     * Public methods
     */

    setData = data => {
        if (!data) {
            return;
        }

        if (data.targetNumber) {
            this.text.text(data.targetNumber);
        }
    };

    animateIn = () => {
        this.clearTween().visible().css({ opacity: 0 }).tween({ opacity: 1 }, 400, 'easeOutCubic');
    };

    animateOut = () => {
        this.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic', () => {
            this.invisible();
        });
    };
}
