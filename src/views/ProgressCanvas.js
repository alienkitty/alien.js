import { clearTween, ticker, tween } from '../utils/Tween.js';
import { radians } from '../utils/Utils.js';

import { Config } from '../config/Config.js';
import { Events } from '../config/Events.js';
import { Interface } from '../utils/Interface.js';
// import { Stage } from '../controllers/Stage.js';

export class ProgressCanvas extends Interface {
    constructor() {
        super(null, 'canvas');

        const size = 90;

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.radius = size * 0.4;
        this.startAngle = radians(-90);
        this.progress = 0;
        this.needsUpdate = false;

        this.initCanvas();
    }

    initCanvas() {
        this.context = this.element.getContext('2d');
    }

    addListeners() {
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        ticker.remove(this.onUpdate);
    }

    /**
     * Event handlers
     */

    onUpdate = () => {
        if (this.needsUpdate) {
            this.update();
        }
    };

    onProgress = ({ progress }) => {
        clearTween(this);

        this.needsUpdate = true;

        tween(this, { progress }, 500, 'easeOutCubic', () => {
            this.needsUpdate = false;

            if (this.progress >= 1) {
                this.complete();
            }
        });
    };

    /**
     * Public methods
     */

    resize = () => {
        // const dpr = Stage.dpr;
        const dpr = 2;

        this.element.width = Math.round(this.width * dpr);
        this.element.height = Math.round(this.height * dpr);
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.context.scale(dpr, dpr);

        this.context.lineWidth = 1.5;
        this.context.strokeStyle = Config.UI_COLOR;

        this.update();
    };

    update = () => {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, this.startAngle, this.startAngle + radians(360 * this.progress));
        this.context.stroke();
    };

    complete() {
        this.removeListeners();

        this.events.emit(Events.COMPLETE);
    }

    animateIn = () => {
        this.addListeners();
        this.resize();
    };

    animateOut = () => {
        this.tween({ scale: 0.9, opacity: 0 }, 400, 'easeInCubic');
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
