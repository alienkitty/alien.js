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
        this.onPointerMove(e);
    };

    static onPointerMove = ({ clientX, clientY }) => {
        if (!this.view.visible) {
            return;
        }

        this.mouse.x = (clientX / Stage.width) * 2 - 1;
        this.mouse.y = 1 - (clientY / Stage.height) * 2;
    };

    static onPointerUp = e => {
        this.onPointerMove(e);
    };

    /**
     * Public methods
     */

    static resize = () => {
        // const { width, height } = WorldController.getFrustum(this.view.light.position.z);
        const { width, height } = WorldController.getFrustum();

        this.width = width;
        this.height = height;
    };

    static update = () => {
        this.view.update();
    };

    static animateIn = () => {
        this.view.animateIn();
    };

    static ready = () => this.view.ready();
}
