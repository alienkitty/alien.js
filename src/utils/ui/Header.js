/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../Interface.js';
import { HeaderInfo } from './HeaderInfo.js';

export class Header extends Interface {
    constructor({
        styles
    }) {
        super('.header');

        this.styles = styles;

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({
            position: 'absolute',
            left: 20,
            top: 20,
            right: 20
        });
    }

    initViews() {
        this.info = new HeaderInfo({ styles: this.styles });
        this.info.css({
            x: -10,
            opacity: 0
        });
        this.add(this.info);
    }

    /**
     * Public methods
     */

    animateIn = () => {
        this.info.tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 200);
    };

    animateOut = () => {
        this.info.tween({ opacity: 0 }, 500, 'easeInCubic');
    };
}
