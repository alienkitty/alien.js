import { Events, Interface, Stage, clearTween, tween } from 'alien.js';

import { Config } from '../../config/Config.js';
import { Global } from '../../config/Global.js';
import { AudioController } from '../../controllers/audio/AudioController.js';

export class MuteButton extends Interface {
    constructor() {
        super('.button');

        this.width = 24;
        this.height = 16;
        this.progress = 1;
        this.yMultiplier = Global.SOUND ? 1 : 0;
        this.needsUpdate = false;
        this.animatedIn = false;

        this.initHTML();
        this.initCanvas();
        this.initLine();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.css({
            right: 22,
            bottom: 20,
            width: this.width + 20,
            height: this.height + 20,
            zIndex: 3,
            cursor: 'pointer',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });
    }

    initCanvas() {
        this.canvas = new Interface(null, 'canvas');
        this.canvas.css({
            left: '50%',
            top: '50%',
            marginLeft: -this.width / 2,
            marginTop: -this.height / 2
        });
        this.context = this.canvas.element.getContext('2d');

        const dpr = 2;

        this.canvas.element.width = Math.round(this.width * dpr);
        this.canvas.element.height = Math.round(this.height * dpr);
        this.canvas.element.style.width = this.width + 'px';
        this.canvas.element.style.height = this.height + 'px';
        this.context.scale(dpr, dpr);

        this.add(this.canvas);
    }

    initLine() {
        this.line = {};
        this.line.lineWidth = 1.5;
        this.line.strokeStyle = Stage.rootStyle.getPropertyValue('--main-color').trim();
    }

    drawLine() {
        const width = this.width + 1;
        const height = this.height / 2;
        const progress = width * this.progress;
        const increase = 90 / 180 * Math.PI / (height / 2);

        this.context.lineWidth = this.line.lineWidth;
        this.context.strokeStyle = this.line.strokeStyle;
        this.context.beginPath();

        let counter = 0;
        let x = 0;
        let y = height;

        for (let i = -4; i <= width; i++) {
            if (progress >= i) {
                this.context.moveTo(x, y);

                x = i;
                y = height - Math.sin(counter) * (height - 1) * this.yMultiplier;
                counter += increase;

                this.context.lineTo(x, y);
            }
        }

        this.context.stroke();
    }

    addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onResize = () => {
        if (Stage.width < Config.BREAKPOINT) {
            this.css({
                right: 12,
                bottom: 10
            });
        } else {
            this.css({
                right: 22,
                bottom: 20
            });
        }
    };

    onHover = ({ type }) => {
        if (!this.animatedIn) {
            return;
        }

        clearTween(this);

        this.needsUpdate = true;

        if (type === 'mouseenter') {
            tween(this, { yMultiplier: Global.SOUND ? 0.7 : 0.3 }, 275, 'easeInOutCubic', () => {
                this.needsUpdate = false;
            });
        } else {
            tween(this, { yMultiplier: Global.SOUND ? 1 : 0 }, 275, 'easeInOutCubic', () => {
                this.needsUpdate = false;
            });
        }
    };

    onClick = () => {
        if (Global.SOUND) {
            AudioController.mute();
            Global.SOUND = false;

            clearTween(this);

            this.needsUpdate = true;

            tween(this, { yMultiplier: 0 }, 300, 'easeOutCubic', () => {
                this.needsUpdate = false;
            });
        } else {
            AudioController.unmute();
            Global.SOUND = true;

            clearTween(this);

            this.needsUpdate = true;

            tween(this, { yMultiplier: 1 }, 300, 'easeOutCubic', () => {
                this.needsUpdate = false;
            });
        }

        localStorage.setItem('sound', JSON.stringify(Global.SOUND));
    };

    /**
     * Public methods
     */

    update = () => {
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        this.drawLine();
    };

    animateIn = () => {
        clearTween(this);

        this.progress = 0;
        this.needsUpdate = true;

        tween(this, { progress: 1 }, 1000, 'easeInOutExpo', () => {
            this.needsUpdate = false;
            this.animatedIn = true;

            this.css({ pointerEvents: 'auto' });
        });

        this.tween({ opacity: 1 }, 400, 'easeOutCubic');
    };

    animateOut = () => {
        this.animatedIn = false;

        this.css({ pointerEvents: 'none' });

        clearTween(this);

        this.progress = 1;
        this.needsUpdate = true;

        tween(this, { progress: 0 }, 1000, 'easeInOutQuart', () => {
            this.needsUpdate = false;
        });

        this.tween({ opacity: 0 }, 400, 'easeOutCubic');
    };

    destroy = () => {
        this.removeListeners();

        clearTween(this);

        return super.destroy();
    };
}
