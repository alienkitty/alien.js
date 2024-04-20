import { ColorManagement, LinearSRGBColorSpace, Mesh, OrthographicCamera, Vector2, WebGLRenderer } from 'three';

import { getFullscreenTriangle } from '@alienkitty/space.js/three';

export class WorldController {
    static init() {
        this.initWorld();

        this.addListeners();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            depth: false
        });

        // Disable color management
        ColorManagement.enabled = false;
        this.renderer.outputColorSpace = LinearSRGBColorSpace;

        // Output canvas
        this.element = this.renderer.domElement;

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screenTriangle = getFullscreenTriangle();
        this.screen = new Mesh(this.screenTriangle, this.material);
        this.screen.frustumCulled = false;

        // Global uniforms
        this.resolution = { value: new Vector2() };
        this.texelSize = { value: new Vector2() };
        this.aspect = { value: 1 };
        this.time = { value: 0 };
        this.frame = { value: 0 };
    }

    static addListeners() {
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
    }

    // Event handlers

    static onTouchStart = e => {
        e.preventDefault();
    };

    // Public methods

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.texelSize.value.set(1 / width, 1 / height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;
    };
}
