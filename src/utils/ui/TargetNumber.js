/**
 * @author pschroen / https://ufo.ai/
 */

import { Styles } from '../../config/Styles.js';
import { Interface } from '../Interface.js';

export class TargetNumber extends Interface {
    constructor({
        styles = Styles
    } = {}) {
        super('.number');

        this.styles = styles;

        const size = window.devicePixelRatio > 1 ? 17 : 18;

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
            border: `${window.devicePixelRatio > 1 ? 1.5 : 1}px solid var(--ui-color)`
        });

        this.text = new Interface('.text');
        this.text.css({
            position: 'absolute',
            left: window.devicePixelRatio > 1 ? 4 : 5,
            ...this.styles.number,
            lineHeight: this.height - (window.devicePixelRatio > 1 ? 3 : 2),
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
