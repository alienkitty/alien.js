/**
 * @author pschroen / https://ufo.ai/
 */

import { Events } from '../../config/Events.js';
import { Styles } from '../../config/Styles.js';
import { Interface } from '../Interface.js';
import { Stage } from '../Stage.js';
import { Header } from './Header.js';

import { ticker } from '../../tween/Ticker.js';

export class UI extends Interface {
    constructor({
        fps = false,
        styles = Styles
    } = {}) {
        super('.ui');

        this.fps = fps;
        this.styles = styles;

        if (!Stage.root) {
            Stage.root = document.querySelector(':root');
            Stage.rootStyle = getComputedStyle(Stage.root);
        }

        this.invertColors = {
            light: Stage.rootStyle.getPropertyValue('--ui-invert-light-color').trim(),
            lightTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-light-color-triplet').trim(),
            dark: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color').trim(),
            darkTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color-triplet').trim()
        };

        this.startTime = performance.now();

        this.initHTML();
        this.initViews();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            color: 'var(--ui-color)',
            pointerEvents: 'none'
        });
    }

    initViews() {
        if (this.fps) {
            this.header = new Header({ styles: this.styles });
            this.add(this.header);
        }
    }

    addListeners() {
        Stage.events.on(Events.INVERT, this.onInvert);
    }

    removeListeners() {
        Stage.events.off(Events.INVERT, this.onInvert);
    }

    /**
     * Event handlers
     */

    onInvert = ({ invert }) => {
        this.invert(invert);
    };

    /**
     * Public methods
     */

    addPanel = item => {
        if (this.header) {
            this.header.info.panel.add(item);
        }
    };

    invert = isInverted => {
        Stage.root.style.setProperty('--ui-color', isInverted ? this.invertColors.light : this.invertColors.dark);
        Stage.root.style.setProperty('--ui-color-triplet', isInverted ? this.invertColors.lightTriplet : this.invertColors.darkTriplet);
    };

    update = () => {
        if (!ticker.isAnimating) {
            ticker.onTick(performance.now() - this.startTime);
        }

        if (this.header) {
            this.header.info.update();
        }
    };

    animateIn = () => {
        if (this.header) {
            this.header.animateIn();
        }
    };

    animateOut = () => {
        if (this.header) {
            this.header.animateOut();
        }
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
