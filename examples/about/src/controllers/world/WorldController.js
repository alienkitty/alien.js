import {
    Mesh,
    OrthographicCamera,
    Scene,
    Uniform,
    Vector2,
    WebGLRenderer
} from 'three';

import { getFullscreenTriangle } from 'alien.js';

export class WorldController {
    static init() {
        this.initWorld();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({ powerPreference: 'high-performance' });
        this.element = this.renderer.domElement;

        // 2D scene
        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Global geometries
        this.screenTriangle = getFullscreenTriangle();

        this.screen = new Mesh(this.screenTriangle);
        this.screen.frustumCulled = false;
        this.scene.add(this.screen);

        // Global uniforms
        this.resolution = new Uniform(new Vector2());
        this.aspect = new Uniform(1);
        this.time = new Uniform(0);
        this.frame = new Uniform(0);
    }

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;
    };
}
