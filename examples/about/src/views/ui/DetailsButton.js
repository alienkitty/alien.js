import { Events, Interface, Stage, clearTween, tween } from 'alien.js';

import { Config } from '../../config/Config.js';
import { Global } from '../../config/Global.js';
import { Styles } from '../../config/Styles.js';

export class DetailsButton extends Interface {
    constructor() {
        super('.button');

        const size = 20;

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.radius = size * 0.4;
        this.hoverRadius = size * 0.3;
        this.openRadius = size * 0.2;
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.scale = 1;
        this.isOpen = false;
        this.needsUpdate = false;
        this.animatedIn = false;
        this.hoveredIn = false;

        this.initHTML();
        this.initIndex();
        this.initCanvas();
        this.initCircle();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.css({
            left: 19,
            bottom: 18,
            width: this.width + 40,
            height: this.height + 20,
            zIndex: 3,
            cursor: 'pointer',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });
    }

    initIndex() {
        this.index = new Interface('.index');
        this.index.css({
            left: 34,
            top: 12,
            ...Styles.monospaceLabel
        });
        this.index.text(Global.USERS.length);
        this.add(this.index);
    }

    initCanvas() {
        this.canvas = new Interface(null, 'canvas');
        this.canvas.css({
            left: 10,
            top: 10,
            // width: this.width,
            // height: this.height,
            transformOrigin: '0 0',
            transform: 'scale(0.5)'
        });
        this.context = this.canvas.element.getContext('2d');

        const dpr = 2;

        this.canvas.element.width = Math.round(this.width * dpr);
        this.canvas.element.height = Math.round(this.height * dpr);
        // this.canvas.element.style.width = this.width + 'px';
        // this.canvas.element.style.height = this.height + 'px';
        this.context.scale(dpr, dpr);

        this.add(this.canvas);
    }

    initCircle() {
        this.circle = {};
        this.circle.x = this.x;
        this.circle.y = this.y;
        this.circle.radius = this.radius;
        this.circle.scale = 1;
        this.circle.lineWidth = 1.5;
        this.circle.strokeStyle = Stage.rootStyle.getPropertyValue('--main-color').trim();
    }

    drawCircle() {
        this.context.lineWidth = this.circle.lineWidth;
        this.context.strokeStyle = this.circle.strokeStyle;
        this.context.beginPath();
        this.context.arc(this.circle.x, this.circle.y, this.circle.radius, this.startAngle, this.endAngle);
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
                left: 9,
                bottom: 8
            });
        } else {
            this.css({
                left: 19,
                bottom: 18
            });
        }
    };

    onHover = ({ type }) => {
        if (!this.animatedIn) {
            return;
        }

        clearTween(this.circle);

        this.needsUpdate = true;

        if (this.isOpen) {
            if (type === 'mouseenter') {
                this.hoveredIn = true;

                tween(this.circle, { radius: this.hoverRadius }, 275, 'easeInOutCubic', () => {
                    this.needsUpdate = false;
                });
            } else {
                this.hoveredIn = false;

                tween(this.circle, { radius: this.openRadius }, 275, 'easeInOutCubic', () => {
                    this.needsUpdate = false;
                });
            }
        } else {
            if (type === 'mouseenter') {
                this.hoveredIn = true;

                const start = () => {
                    tween(this.circle, { radius: this.hoverRadius }, 800, 'easeOutQuart', () => {
                        tween(this.circle, { radius: this.radius, spring: 1, damping: 0.5 }, 800, 'easeOutElastic', 500, () => {
                            if (this.hoveredIn) {
                                start();
                            } else {
                                this.needsUpdate = false;
                            }
                        });
                    });
                };

                start();
            } else {
                this.hoveredIn = false;

                tween(this.circle, { radius: this.radius, spring: 1, damping: 0.5 }, 800, 'easeOutElastic', 200, () => {
                    this.needsUpdate = false;
                });
            }
        }
    };

    onClick = () => {
        this.events.emit(Events.CLICK);
    };

    /**
     * Public methods
     */

    update = () => {
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        this.drawCircle();
    };

    animateIn = () => {
        this.css({ pointerEvents: 'auto' });

        clearTween(this.circle);

        this.circle.radius = 0;
        this.scale = 0;
        this.needsUpdate = true;

        tween(this.circle, { radius: this.radius, scale: 1 }, 1000, 'easeInOutExpo', () => {
            this.needsUpdate = false;
            this.animatedIn = true;
        });

        this.tween({ opacity: 1 }, 400, 'easeOutCubic');
    };

    animateOut = () => {
        this.animatedIn = false;

        this.css({ pointerEvents: 'none' });

        clearTween(this.circle);

        this.needsUpdate = true;

        tween(this.circle, { radius: 0, scale: 0 }, 1000, 'easeInOutQuart', () => {
            this.needsUpdate = false;
        });

        this.tween({ opacity: 0 }, 400, 'easeOutCubic');
    };

    open = () => {
        this.isOpen = true;

        clearTween(this.circle);

        this.needsUpdate = true;

        tween(this.circle, { radius: this.openRadius, scale: 0 }, 400, 'easeOutCubic', () => {
            this.needsUpdate = false;
        });
    };

    close = () => {
        this.isOpen = false;

        clearTween(this.circle);

        this.needsUpdate = true;

        tween(this.circle, { radius: this.radius, scale: 1 }, 400, 'easeOutCubic', () => {
            this.needsUpdate = false;
        });
    };

    swapIndex() {
        if (String(Global.USERS.length) === this.index.text()) {
            return;
        }

        this.index.tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
            this.index.text(Global.USERS.length);
            this.index.css({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
        });
    }

    destroy = () => {
        this.removeListeners();

        clearTween(this);
        clearTween(this.circle);

        return super.destroy();
    };
}
