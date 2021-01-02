import { Vector2 } from 'three';

import { WorldController } from './WorldController.js';
import { Stage } from '../Stage.js';

export class SceneController {
    static init(view) {
        this.view = view;

        this.mouse = new Vector2();

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
        if (!this.view.visible) {
            return;
        }

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

    static resize = () => {
        // const frustum = WorldController.getFrustum(this.view.mallet.position.z);
        const frustum = WorldController.getFrustum();

        this.width = frustum.width;
        this.height = frustum.height;
    };

    static update = () => {
        this.view.update();
    };

    static animateIn = () => {
        this.view.animateIn();
    };

    static ready = () => this.view.ready();
}
