/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../Interface.js';
import { TargetNumber } from './TargetNumber.js';
import { Panel } from '../panel/Panel.js';

export class PointText extends Interface {
    constructor() {
        super('.text');

        this.locked = false;

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({
            position: 'absolute',
            left: 10,
            top: -15,
            pointerEvents: 'none'
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'absolute',
            cursor: 'move'
        });
        this.add(this.container);

        this.name = new Interface('.name');
        this.name.css({
            position: 'relative',
            lineHeight: 18,
            whiteSpace: 'nowrap'
        });
        this.container.add(this.name);

        this.type = new Interface('.type');
        this.type.css({
            position: 'relative',
            opacity: 0.7
        });
        this.container.add(this.type);
    }

    initViews() {
        this.number = new TargetNumber();
        this.number.css({
            left: -(this.number.width + 10),
            top: '50%',
            marginTop: -Math.round(this.number.height / 2)
        });
        this.container.add(this.number);

        this.panel = new Panel();
        this.panel.css({
            position: 'absolute',
            left: -10,
            top: 36
        });
        this.add(this.panel);
    }

    /**
     * Public methods
     */

    setData = data => {
        if (!data) {
            return;
        }

        let height = 0;

        if (data.name) {
            this.name.text(data.name);

            height += 18;
        }

        if (data.type) {
            this.type.text(data.type);

            height += 15;
        }

        this.panel.css({ top: height + 3 });
    };

    lock = () => {
        this.number.animateIn();

        this.locked = true;
    };

    unlock = () => {
        this.number.animateOut();

        this.locked = false;
    };

    open = moved => {
        if (moved) {
            return;
        }

        this.css({ pointerEvents: 'auto' });

        this.clearTween().tween({ left: this.number.width + 30, opacity: 1 }, 400, 'easeOutCubic');

        this.panel.animateIn();
    };

    close = () => {
        this.css({ pointerEvents: 'none' });

        this.clearTween().tween({ left: 10, opacity: 1 }, 400, 'easeInCubic', 200);

        this.number.animateOut();
        this.panel.animateOut();
    };

    animateIn = () => {
        this.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 400, 'easeOutCubic', 200);
    };

    animateOut = callback => {
        this.clearTween().tween({ opacity: 0 }, 500, 'easeInCubic', 200, callback);
    };
}
