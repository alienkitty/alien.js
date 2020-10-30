import { Vector2, Vector3 } from 'three';

import { Stage } from '../Stage.js';

import { range } from '../../utils/Utils.js';

export class CameraController {
    static init(camera) {
        this.camera = camera;

        this.mouse = new Vector2(Stage.width / 2, Stage.height / 2);
        this.lookAt = new Vector3();
        this.origin = new Vector3();
        this.target = new Vector3();
        this.targetXY = new Vector2(8, 4);
        this.origin.copy(this.camera.position);

        this.lerpSpeed = 0.07;

        this.addListeners();
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
            event.x = e.changedTouches[0].pageX;
            event.y = e.changedTouches[0].pageY;
        } else {
            event.x = e.pageX;
            event.y = e.pageY;
        }

        this.mouse.copy(event);
    };

    /**
     * Public methods
     */

    static resize = (width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };

    static update = () => {
        this.target.x = this.origin.x + this.targetXY.x * range(this.mouse.x, 0, Stage.width, -1, 1, true);
        this.target.y = this.origin.y + this.targetXY.y * range(this.mouse.y, 0, Stage.height, -1, 1, true);
        this.target.z = this.origin.z;

        this.camera.position.lerp(this.target, this.lerpSpeed);
        this.camera.lookAt(this.lookAt);
    };
}
