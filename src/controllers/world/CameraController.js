import { Vector2, Vector3 } from 'three';

import { Config } from '../../config/Config.js';
import { Stage } from '../Stage.js';

export class CameraController {
    static init(camera) {
        this.camera = camera;

        this.mouse = new Vector2();
        this.lookAt = new Vector3();
        this.origin = new Vector3();
        this.target = new Vector3();
        this.targetXY = new Vector2(8, 4);
        this.origin.copy(this.camera.position);

        this.lerpSpeed = 0.07;
        this.enabled = false;

        if (!Config.ORBIT) {
            this.addListeners();
        }
    }

    static addListeners() {
        Stage.element.addEventListener('touchstart', this.onTouchStart);
        Stage.element.addEventListener('mousedown', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('mousemove', this.onTouchMove);
    }

    /**
     * Event handlers
     */

    static onTouchStart = e => {
        e.preventDefault();

        this.onTouchMove(e);
    };

    static onTouchMove = e => {
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
    };

    /**
     * Public methods
     */

    static resize = (width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };

    static update = () => {
        if (!this.enabled) {
            return;
        }

        this.target.x = this.origin.x + this.targetXY.x * this.mouse.x;
        this.target.y = this.origin.y + this.targetXY.y * this.mouse.y;
        this.target.z = this.origin.z;

        this.camera.position.lerp(this.target, this.lerpSpeed);
        this.camera.lookAt(this.lookAt);
    };

    static animateIn = () => {
        if (Config.ORBIT) {
            return;
        }

        this.enabled = true;
    };
}
