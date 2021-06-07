import { Raycaster, Vector2 } from 'three';

import { Device } from '../../config/Device.js';
import { Stage } from '../Stage.js';

export class InputManager {
    static init(camera) {
        this.camera = camera;

        this.raycaster = new Raycaster();
        this.mouse = new Vector2(-1, -1);
        this.delta = new Vector2();
        this.meshes = [];
        this.objects = [];
        this.hover = null;
        this.click = null;
        this.lastTime = null;
        this.lastMouse = new Vector2();

        this.raycastInterval = 0.1; // 10 frames per second
        this.lastRaycast = 0;
        this.enabled = true;

        this.addListeners();
    }

    static addListeners() {
        Stage.element.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    static removeListeners() {
        Stage.element.removeEventListener('pointerdown', this.onPointerDown);
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
            const event = {};

            if (e.changedTouches && e.changedTouches.length) {
                event.x = e.changedTouches[0].clientX;
                event.y = e.changedTouches[0].clientY;
            } else {
                event.x = e.clientX;
                event.y = e.clientY;
            }

            this.mouse.x = (event.x / Stage.width) * 2 - 1;
            this.mouse.y = -(event.y / Stage.height) * 2 + 1;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.meshes);

        if (intersects.length) {
            const object = this.objects[this.meshes.indexOf(intersects[0].object)];

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

    static add = object => {
        this.meshes.push(object.hitMesh);
        this.objects.push(object);
    };

    static remove = object => {
        if (object === this.hover) {
            this.hover.onHover({ type: 'out' });
            this.hover = null;
            Stage.css({ cursor: '' });
        }

        const index = this.meshes.indexOf(object.hitMesh);

        if (~index) {
            this.meshes.splice(index, 1);
            this.objects.splice(index, 1);
        }
    };
}
