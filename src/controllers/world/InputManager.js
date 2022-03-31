import { Raycaster, Vector2 } from 'three';

import { Device } from '../../config/Device.js';
import { Stage } from '../../utils/Stage.js';

export class InputManager {
    static init(camera) {
        this.camera = camera;

        this.objects = [];
        this.raycaster = new Raycaster();
        this.mouse = new Vector2(-1, -1);
        this.delta = new Vector2();
        this.hover = null;
        this.click = null;
        this.lastTime = null;
        this.lastMouse = new Vector2();
        this.raycastInterval = 1 / 10; // 10 frames per second
        this.lastRaycast = 0;
        this.enabled = true;

        this.addListeners();
    }

    static addListeners() {
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    static removeListeners() {
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
    }

    /**
     * Event handlers
     */

    static onPointerDown = e => {
        if (!this.enabled) {
            return;
        }

        this.onPointerMove(e);

        if (this.hover) {
            this.click = this.hover;
            this.lastTime = performance.now();
            this.lastMouse.copy(this.mouse);
        }
    };

    static onPointerMove = e => {
        if (!this.enabled) {
            return;
        }

        if (e) {
            this.mouse.x = (e.clientX / Stage.width) * 2 - 1;
            this.mouse.y = 1 - (e.clientY / Stage.height) * 2;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersection = this.raycaster.intersectObjects(this.objects);

        if (intersection.length) {
            let object = intersection[0].object;

            if (object.parent.isGroup) {
                object = object.parent;
            }

            if (!this.hover) {
                this.hover = object;
                this.hover.onHover({ type: 'over' });
                Stage.css({ cursor: 'pointer' });
            } else if (this.hover !== object) {
                this.hover.onHover({ type: 'out' });
                this.hover = object;
                this.hover.onHover({ type: 'over' });
                Stage.css({ cursor: 'pointer' });
            }
        } else if (this.hover) {
            this.hover.onHover({ type: 'out' });
            this.hover = null;
            Stage.css({ cursor: '' });
        }
    };

    static onPointerUp = e => {
        if (!this.enabled || !this.click) {
            return;
        }

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 750 || this.delta.subVectors(this.mouse, this.lastMouse).length() > 50) {
            this.click = null;
            return;
        }

        if (this.click === this.hover) {
            this.click.onClick();
        }

        this.click = null;
    };

    /**
     * Public methods
     */

    static update = time => {
        if (!Device.mobile && time - this.lastRaycast > this.raycastInterval) {
            this.onPointerMove();
            this.lastRaycast = time;
        }
    };

    static add = (...objects) => {
        this.objects.push(...objects);
    };

    static remove = (...objects) => {
        objects.forEach(object => {
            const index = this.objects.indexOf(object);

            if (~index) {
                this.objects.splice(index, 1);
            }

            if (object.parent.isGroup) {
                object = object.parent;
            }

            if (object === this.hover) {
                this.hover.onHover({ type: 'out' });
                this.hover = null;
                Stage.css({ cursor: '' });
            }
        });
    };
}
