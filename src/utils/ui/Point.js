/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from 'three/src/math/Vector2.js';

import { Interface } from '../Interface.js';
import { Stage } from '../Stage.js';
import { PointText } from './PointText.js';

import { tween } from '../../tween/Tween.js';

export class Point extends Interface {
    constructor(panel, tracker) {
        super('.point');

        this.panel = panel;
        this.tracker = tracker;

        this.position = new Vector2();
        this.origin = new Vector2();
        this.originPosition = new Vector2();
        this.target = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.lastTime = null;
        this.lastMouse = new Vector2();
        this.lastOrigin = new Vector2();
        this.lerpSpeed = 0.07;
        this.openColor = null;
        this.isOpen = false;
        this.isDown = false;
        this.isMove = false;

        this.initHTML();
        this.initViews();

        this.addListeners();
    }

    initHTML() {
        this.invisible();
        this.css({
            position: 'absolute',
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }

    initViews() {
        this.text = new PointText();
        this.add(this.text);
    }

    addListeners() {
        Stage.events.on('color_picker', this.onColorPicker);
        this.text.container.element.addEventListener('mouseenter', this.onHover);
        this.text.container.element.addEventListener('mouseleave', this.onHover);
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    removeListeners() {
        Stage.events.off('color_picker', this.onColorPicker);
        this.text.container.element.removeEventListener('mouseenter', this.onHover);
        this.text.container.element.removeEventListener('mouseleave', this.onHover);
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointerup', this.onPointerUp);
    }

    /**
     * Event handlers
     */

    onColorPicker = ({ open, target }) => {
        if (!this.element.contains(target.element)) {
            return;
        }

        if (open) {
            this.text.container.tween({ opacity: 0.35 }, 400, 'easeInOutSine');
            this.openColor = target;
        } else {
            this.text.container.tween({ opacity: 1 }, 400, 'easeInOutSine');
            this.openColor = null;
        }
    };

    onHover = ({ type }) => {
        if (type === 'mouseenter') {
            this.panel.onHover({ type: 'over' });
        } else {
            this.panel.onHover({ type: 'out' });
        }
    };

    onPointerDown = e => {
        if (!this.isOpen) {
            return;
        }

        if (this.text.container.element.contains(e.target)) {
            this.isDown = true;
        }

        this.onPointerMove(e);

        window.addEventListener('pointermove', this.onPointerMove);
    };

    onPointerMove = ({ clientX, clientY }) => {
        const event = {
            x: clientX,
            y: clientY
        };

        this.mouse.copy(event);

        if (!this.lastTime) {
            this.lastTime = performance.now();
            this.lastMouse.copy(event);
            this.lastOrigin.copy(this.origin);
        }

        if (this.isDown) {
            this.delta.subVectors(this.mouse, this.lastMouse);
            this.origin.addVectors(this.lastOrigin, this.delta);

            this.isMove = true;
        }
    };

    onPointerUp = e => {
        if (!this.isOpen || !this.lastTime) {
            return;
        }

        window.removeEventListener('pointermove', this.onPointerMove);

        this.isDown = false;

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 750 || this.delta.subVectors(this.mouse, this.lastMouse).length() > 50) {
            this.lastTime = null;
            return;
        }

        if (this.openColor && !this.openColor.element.contains(e.target)) {
            Stage.events.emit('color_picker', { open: false, target: this });
        }

        if (this.tracker && this.tracker.isVisible && this.text.container.element.contains(e.target)) {
            if (!this.tracker.animatedIn) {
                this.tracker.show();
            } else if (!this.tracker.locked) {
                this.text.lock();
                this.tracker.lock();
            } else {
                this.text.unlock();
                this.tracker.unlock();
                this.tracker.hide(true);
            }
        }

        this.lastTime = null;
    };

    /**
     * Public methods
     */

    setData = data => {
        this.text.setData(data);
    };

    update = () => {
        this.position.lerp(this.target, this.lerpSpeed);
        this.originPosition.addVectors(this.origin, this.position);

        this.css({ left: Math.round(this.originPosition.x), top: Math.round(this.originPosition.y) });
    };

    open = () => {
        this.text.open(this.isMove);

        this.isOpen = true;
    };

    close = () => {
        tween(this.origin, { x: 0, y: 0 }, 400, 'easeOutCubic');

        this.text.close();

        this.isOpen = false;
        this.isMove = false;
    };

    animateIn = () => {
        this.visible();
        this.css({ opacity: 1 });
        this.text.animateIn();
    };

    animateOut = () => {
        this.text.animateOut(() => {
            this.invisible();
        });
    };

    inactive = () => {
        this.tween({ opacity: 0 }, 300, 'easeOutSine');
        this.close();
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
