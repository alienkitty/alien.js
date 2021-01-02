import { ACESFilmicToneMapping, Color, PerspectiveCamera, Scene, Uniform, Vector2, WebGL1Renderer } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Config } from '../../config/Config.js';
import { TextureLoader } from '../../loaders/world/TextureLoader.js';
// import { Interface } from '../../utils/Interface.js';

import { getFrustum, getFullscreenTriangle } from '../../utils/world/Utils3D.js';

export class WorldController {
    static init() {
        this.initWorld();
        this.initLights();
        this.initLoaders();
        // this.initControls();
    }

    static initWorld() {
        this.renderer = new WebGL1Renderer({
            powerPreference: 'high-performance',
            stencil: false,
            // antialias: true,
            // alpha: true
        });
        this.element = this.renderer.domElement;
        // this.element = new Interface(this.renderer.domElement);

        // Tone mapping
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(Config.BG_COLOR);
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.1;
        this.camera.far = 1000;
        this.camera.position.z = 6;

        // Global geometries
        this.screenTriangle = getFullscreenTriangle();

        // Global uniforms
        this.resolution = new Uniform(new Vector2());
        this.aspect = new Uniform(1);
        this.time = new Uniform(0);
        this.frame = new Uniform(0);
    }

    static initLights() {
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
    }

    static initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        // this.controls.enableZoom = false;
        // this.controls.enabled = false;
    }

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;

        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }
    };

    static getTexture = path => this.textureLoader.load(path);

    static getFrustum = offsetZ => getFrustum(this.camera, offsetZ);
}
